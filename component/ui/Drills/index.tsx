import React from "react";
import { RoadmapView } from "./RoadmapView";

export { RoadmapView } from "./RoadmapView";
export { DrillContainer } from "./DrillContainer";
export { SentenceView } from "./SentenceView";
export { ResultView } from "./ResultView";
export type { Chapter, Lesson, LessonStatus } from "./RoadmapView";
export type { DrillTask, DrillTaskType, DrillMode, TaskVocabularyItem } from "./DrillContainer";

export const Drills = () => {
  return <RoadmapView />;
};
