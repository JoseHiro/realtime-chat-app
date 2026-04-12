import fs from 'fs';
import path from 'path';
import { PrismaClient, TaskType, TaskMode } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(process.cwd(), 'seed.txt');
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let currentSection = '';
  const lessonId = 'lesson-greetings'; // must exist (e.g. from prisma/seed.ts)
  let taskOrder = 0;

  console.log('🚀 Starting import from seed.txt...');

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    if (trimmedLine.startsWith('//')) continue;

    if (trimmedLine === '[VOCABULARY]') {
      currentSection = 'VOCABULARY';
      continue;
    }
    if (trimmedLine === '[TASKS]') {
      currentSection = 'TASKS';
      const existing = await prisma.lessonTask.findMany({
        where: { lessonId },
        select: { taskId: true },
      });
      const taskIds = existing.map((lt) => lt.taskId);
      if (taskIds.length > 0) {
        await prisma.lessonTask.deleteMany({ where: { lessonId } });
        await prisma.taskVocabulary.deleteMany({ where: { taskId: { in: taskIds } } });
        await prisma.task.deleteMany({ where: { id: { in: taskIds } } });
        console.log('Cleared', taskIds.length, 'existing tasks for', lessonId);
      }
      continue;
    }

    if (currentSection === 'VOCABULARY') {
      const [kanji, hiragana, meaning, tags] = trimmedLine.split(',');
      const kanjiVal = kanji === 'null' || kanji === '' ? null : kanji;
      const existing = await prisma.vocabulary.findFirst({
        where: { hiragana, kanji: kanjiVal },
      });
      if (!existing) {
        await prisma.vocabulary.create({
          data: {
            kanji: kanjiVal,
            hiragana,
            meaning,
            tags: tags ? [tags.trim()] : [],
          },
        });
      }
    }

    if (currentSection === 'TASKS') {
      const parts = trimmedLine.split(',');
      const type = parts[0]?.trim() as TaskType;
      const mode = parts[1]?.trim() as TaskMode;
      const targetJapanese = parts[2]?.trim();
      const english = parts[3]?.trim();
      const acceptedAnswers = parts[4] ? [parts[4].trim()] : [];
      // vocab_links: rest of line, strip surrounding quotes
      const vocabLinksStr = parts.slice(5).join(',').replace(/^"|"$/g, '').trim();

      let mainVocabularyId: string | undefined;
      if (type === 'VOCAB' && targetJapanese) {
        const mainVocab = await prisma.vocabulary.findFirst({
          where: { OR: [{ kanji: targetJapanese }, { hiragana: targetJapanese }] },
        });
        if (mainVocab) mainVocabularyId = mainVocab.id;
      }

      const task = await prisma.task.create({
        data: {
          type,
          mode,
          targetJapanese: targetJapanese ?? undefined,
          english: english ?? undefined,
          acceptedAnswers,
          mainVocabularyId,
          lessons: { create: { lessonId, order: taskOrder++ } },
        },
      });

      if (vocabLinksStr) {
        const links = vocabLinksStr.split(',');
        for (const link of links) {
          const [word, range] = link.split(':').map((s) => s.trim());
          if (!word || !range) continue;
          const [start, end] = range.split('-').map(Number);

          const vocab = await prisma.vocabulary.findFirst({
            where: { OR: [{ kanji: word }, { hiragana: word }] },
          });

          if (vocab) {
            await prisma.taskVocabulary.create({
              data: {
                taskId: task.id,
                vocabularyId: vocab.id,
                startIndex: start,
                endIndex: end,
              },
            });
          }
        }
      }
    }
  }

  console.log('✅ Import successful!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
