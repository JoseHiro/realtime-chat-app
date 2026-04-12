import { PrismaClient, TaskType, TaskMode } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Start seeding...')

  // 1. 全データを一旦クリーンアップ (開発時のみ)
  await prisma.taskVocabulary.deleteMany()
  await prisma.lessonTask.deleteMany()
  await prisma.task.deleteMany()
  await prisma.vocabulary.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.chapter.deleteMany()

  // 2. Vocabulary (辞書) の作成
  const vocab = {
    watashi: await prisma.vocabulary.create({
      data: { kanji: "私", hiragana: "わたし", meaning: "I/Me", tags: ["Noun"] }
    }),
    sensei: await prisma.vocabulary.create({
      data: { kanji: "先生", hiragana: "せんせい", meaning: "Teacher", tags: ["Noun"] }
    }),
    gakusei: await prisma.vocabulary.create({
      data: { kanji: "学生", hiragana: "がくせい", meaning: "Student", tags: ["Noun"] }
    }),
    wa: await prisma.vocabulary.create({
      data: { kanji: null, hiragana: "は", meaning: "Topic marker", tags: ["Particle"] }
    }),
    desu: await prisma.vocabulary.create({
      data: { kanji: null, hiragana: "です", meaning: "am/is/are", tags: ["Auxiliary"] }
    }),
  }

  // 3. Chapter & Lesson の作成
  const chapter1 = await prisma.chapter.create({
    data: {
      title: "Chapter 1: Basics",
      order: 1,
      lessons: {
        create: {
          id: "lesson-greetings", // slugとして使用
          title: "Self Introduction",
          order: 1,
        }
      }
    },
    include: { lessons: true }
  })

  const lessonId = chapter1.lessons[0].id

  // 4. Tasks の作成
  // Task 1: 単語問題 (Vocab Mimic)
  const task1 = await prisma.task.create({
    data: {
      type: TaskType.VOCAB,
      mode: TaskMode.MIMIC,
      mainVocabularyId: vocab.sensei.id,
      lessons: { create: { lessonId, order: 1 } }
    }
  })

  // Task 2: 文章問題 (Sentence Mimic)
  const task2 = await prisma.task.create({
    data: {
      type: TaskType.SENTENCE,
      mode: TaskMode.MIMIC,
      targetJapanese: "私は先生です",
      english: "I am a teacher",
      acceptedAnswers: ["わたしはせんせいです"],
      lessons: { create: { lessonId, order: 2 } },
      vocabularies: {
        create: [
          { vocabularyId: vocab.watashi.id, startIndex: 0, endIndex: 1 },
          { vocabularyId: vocab.wa.id,      startIndex: 1, endIndex: 2 },
          { vocabularyId: vocab.sensei.id,  startIndex: 2, endIndex: 4 },
          { vocabularyId: vocab.desu.id,    startIndex: 4, endIndex: 6 },
        ]
      }
    }
  })

  // Task 3: 文章問題 (Sentence Translate)
  const task3 = await prisma.task.create({
    data: {
      type: TaskType.SENTENCE,
      mode: TaskMode.TRANSLATE,
      targetJapanese: "私は学生です",
      english: "I am a student",
      acceptedAnswers: ["わたしはがくせいです", "ぼくはがくせいです"],
      lessons: { create: { lessonId, order: 3 } },
      vocabularies: {
        create: [
          { vocabularyId: vocab.watashi.id, startIndex: 0, endIndex: 1 },
          { vocabularyId: vocab.wa.id,      startIndex: 1, endIndex: 2 },
          { vocabularyId: vocab.gakusei.id, startIndex: 2, endIndex: 4 },
          { vocabularyId: vocab.desu.id,    startIndex: 4, endIndex: 6 },
        ]
      }
    }
  })

  console.log('✅ Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
