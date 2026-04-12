import React, { useState } from "react";
import { useRouter } from "next/router";
import { Lock, Check, X } from "lucide-react";
import { cn } from "@lib/utils";

export type LessonStatus = "completed" | "in_progress" | "locked";

export interface Lesson {
  id: string;
  title: string;
  status: LessonStatus;
  /** Optional drill route, e.g. /drills/lesson-1 */
  drillSlug?: string;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface RoadmapViewProps {
  /** Chapters and lessons; uses default sample data if omitted */
  chapters?: Chapter[];
  /** Base path for drill navigation, e.g. /drills */
  drillBasePath?: string;
  /** If true, tapping a lesson opens a modal; if false, navigates directly when not locked */
  useModalForDetails?: boolean;
}

const defaultChapters: Chapter[] = [
  {
    id: "ch1",
    title: "Chapter 1: Basics",
    lessons: [
      { id: "1-1", title: "Greetings", status: "completed", drillSlug: "greetings" },
      { id: "1-2", title: "Numbers 1–10", status: "completed", drillSlug: "numbers" },
      { id: "1-3", title: "Introductions", status: "in_progress", drillSlug: "introductions" },
      { id: "1-4", title: "Particles は & を", status: "locked", drillSlug: "particles" },
      { id: "1-5", title: "Questions", status: "locked", drillSlug: "questions" },
    ],
  },
  {
    id: "ch2",
    title: "Chapter 2: Daily Life",
    lessons: [
      { id: "2-1", title: "Food & Drink", status: "locked", drillSlug: "food" },
      { id: "2-2", title: "Time", status: "locked", drillSlug: "time" },
      { id: "2-3", title: "Shopping", status: "locked", drillSlug: "shopping" },
    ],
  },
  {
    id: "ch3",
    title: "Chapter 3: Conversation",
    lessons: [
      { id: "3-1", title: "Weather", status: "locked", drillSlug: "weather" },
      { id: "3-2", title: "Directions", status: "locked", drillSlug: "directions" },
    ],
  },
];

// Sine-wave x-offsets (px) for the winding path
const PATH_X_OFFSETS = [0, 52, 76, 52, 0, -52, -76, -52];

export function RoadmapView({
  chapters = defaultChapters,
  drillBasePath = "/drills",
  useModalForDetails = true,
}: RoadmapViewProps) {
  const router = useRouter();
  const [selectedLesson, setSelectedLesson] = useState<{ lesson: Lesson; chapterTitle: string } | null>(null);

  const handleLessonClick = (lesson: Lesson, chapterTitle: string) => {
    if (lesson.status === "locked") {
      if (useModalForDetails) setSelectedLesson({ lesson, chapterTitle });
      return;
    }
    if (useModalForDetails) {
      setSelectedLesson({ lesson, chapterTitle });
      return;
    }
    const path = lesson.drillSlug ? `${drillBasePath}/${lesson.drillSlug}` : drillBasePath;
    router.push(path);
  };

  const handleStartLesson = () => {
    if (!selectedLesson) return;
    const path = selectedLesson.lesson.drillSlug
      ? `${drillBasePath}/${selectedLesson.lesson.drillSlug}`
      : drillBasePath;
    setSelectedLesson(null);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-sm px-4 py-8 pb-28">
        <h1 className="mb-8 text-2xl font-bold tracking-tight text-black">Drills</h1>

        {chapters.map((chapter, chapterIndex) => (
          <section key={chapter.id} className="mb-14">
            {/* Chapter unit banner */}
            <div className="mb-10 rounded-2xl bg-black px-5 py-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-green-400">
                Unit {chapterIndex + 1}
              </p>
              <h2 className="mt-0.5 text-base font-bold text-white">{chapter.title}</h2>
            </div>

            {/* Winding lesson path */}
            <div className="relative flex flex-col items-center">
              {chapter.lessons.map((lesson, lessonIndex) => {
                const isLocked = lesson.status === "locked";
                const isCompleted = lesson.status === "completed";
                const isInProgress = lesson.status === "in_progress";
                const xOffset = PATH_X_OFFSETS[lessonIndex % PATH_X_OFFSETS.length];

                return (
                  <div key={lesson.id} className="flex flex-col items-center" style={{ width: "100%" }}>
                    {/* Connector line between nodes */}
                    {lessonIndex > 0 && (
                      <div
                        className={cn(
                          "w-0.5 border-l-2 border-dashed",
                          isLocked ? "border-gray-200 h-7" : "border-green-300 h-7"
                        )}
                      />
                    )}

                    {/* Node + label, offset for winding effect */}
                    <div
                      className="flex flex-col items-center gap-2"
                      style={{ transform: `translateX(${xOffset}px)` }}
                    >
                      {/* "START" speech bubble for the active lesson */}
                      {isInProgress && (
                        <div className="relative flex flex-col items-center">
                          <div className="rounded-xl bg-black px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
                            Start
                          </div>
                          <div className="h-0 w-0 border-x-[6px] border-t-[7px] border-x-transparent border-t-black" />
                        </div>
                      )}

                      {/* Lesson node */}
                      <button
                        type="button"
                        onClick={() => handleLessonClick(lesson, chapter.title)}
                        className={cn(
                          "flex h-[60px] w-[60px] items-center justify-center rounded-full border-b-[5px] transition-all duration-150 active:translate-y-[3px] active:border-b-[2px] focus:outline-none",
                          isLocked &&
                            "cursor-pointer border-gray-300 bg-gray-100 text-gray-400",
                          isCompleted &&
                            "border-green-700 bg-green-500 text-white shadow-md hover:bg-green-600",
                          isInProgress &&
                            "border-green-700 bg-green-500 text-white shadow-lg ring-4 ring-green-100 hover:bg-green-600"
                        )}
                        aria-label={lesson.title}
                      >
                        {isLocked ? (
                          <Lock className="h-6 w-6" aria-hidden />
                        ) : isCompleted ? (
                          <Check className="h-7 w-7 stroke-[2.5]" aria-hidden />
                        ) : (
                          <div className="h-4 w-4 rounded-full bg-white/40" aria-hidden />
                        )}
                      </button>

                      {/* Lesson label */}
                      <span
                        className={cn(
                          "max-w-[80px] text-center text-xs font-semibold leading-tight",
                          isLocked ? "text-gray-400" : "text-gray-800"
                        )}
                      >
                        {lesson.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Lesson detail modal — slides up from bottom on mobile */}
      {selectedLesson && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lesson-modal-title"
          onClick={() => setSelectedLesson(null)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-white p-6 pb-8 shadow-2xl sm:rounded-2xl sm:pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle (mobile) */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 sm:hidden" />

            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-green-600">
                  {selectedLesson.chapterTitle}
                </p>
                <h3 id="lesson-modal-title" className="mt-1 text-xl font-bold text-black">
                  {selectedLesson.lesson.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLesson(null)}
                className="mt-0.5 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-6 text-sm text-gray-500">
              {selectedLesson.lesson.status === "locked"
                ? "Complete the previous lessons to unlock this one."
                : selectedLesson.lesson.status === "completed"
                ? "Great work! Review this lesson or continue to the next."
                : "You're making progress — keep going!"}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedLesson(null)}
                className="flex-1 rounded-xl border-2 border-gray-200 bg-white py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              {selectedLesson.lesson.status !== "locked" && (
                <button
                  type="button"
                  onClick={handleStartLesson}
                  className="flex-1 rounded-xl border-b-4 border-green-700 bg-green-500 py-3 text-sm font-bold text-white hover:bg-green-600 active:translate-y-[2px] active:border-b-[2px]"
                >
                  {selectedLesson.lesson.status === "in_progress" ? "Continue" : "Review"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
