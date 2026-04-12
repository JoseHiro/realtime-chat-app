import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type TaskVocabularyItem = {
  word: string;
  reading: string;
  meaning: string;
};

export type DrillTaskResponse = {
  id: string;
  type: "VOCAB" | "SENTENCE";
  mode: "MIMIC" | "TRANSLATE" | "JUMBLE";
  word?: string;
  reading?: string;
  sentence?: string;
  targetJapanese?: string;
  english?: string;
  acceptedAnswers: string[];
  audioUrl?: string;
  taskVocabulary: TaskVocabularyItem[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ tasks: DrillTaskResponse[] } | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const slug = req.query.slug as string;
  if (!slug) {
    return res.status(400).json({ error: "Missing slug" });
  }

  try {
    const lessonId = slug.startsWith("lesson-") ? slug : `lesson-${slug}`;
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        tasks: {
          orderBy: { order: "asc" },
          include: {
            task: {
              include: {
                mainVocabulary: true,
                vocabularies: {
                  include: { vocabulary: true },
                  orderBy: { startIndex: "asc" },
                },
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    const tasks: DrillTaskResponse[] = lesson.tasks.map((lt) => {
      const t = lt.task;
      const taskVocabulary: TaskVocabularyItem[] = t.vocabularies.map((tv) => ({
        word: tv.vocabulary.kanji ?? tv.vocabulary.hiragana,
        reading: tv.vocabulary.hiragana,
        meaning: tv.vocabulary.meaning,
      }));

      const isVocab = t.type === "VOCAB";
      const main = t.mainVocabulary;

      return {
        id: t.id,
        type: t.type,
        mode: t.mode,
        word: isVocab && main ? (main.kanji ?? main.hiragana) : undefined,
        reading: isVocab && main ? main.hiragana : undefined,
        sentence: !isVocab ? t.targetJapanese ?? undefined : undefined,
        targetJapanese: t.targetJapanese ?? undefined,
        english: t.english ?? undefined,
        acceptedAnswers: t.acceptedAnswers ?? [],
        audioUrl: t.audioUrl ?? undefined,
        taskVocabulary,
      };
    });

    return res.status(200).json({ tasks });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to fetch tasks" });
  }
}
