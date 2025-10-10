// SpeechContext.tsx
import React, { createContext, useContext, useState } from "react";

interface SpeechContextType {
  selectedLevel: string;
  setSelectedLevel: React.Dispatch<React.SetStateAction<string>>;
  selectedPoliteness: string;
  setSelectedPoliteness: React.Dispatch<React.SetStateAction<string>>;
  selectedTheme: string;
  setSelectedTheme: React.Dispatch<React.SetStateAction<string>>;
  customTheme: string;
  setCustomTheme: React.Dispatch<React.SetStateAction<string>>;
  checkGrammarMode: boolean;
  setCheckGrammarMode: React.Dispatch<React.SetStateAction<boolean>>;
  chatId: null | number;
  setChatId: React.Dispatch<React.SetStateAction<number | null>>;
  chatMode: boolean;
  setChatMode: React.Dispatch<React.SetStateAction<boolean>>;
  chatEnded: boolean;
  setChatEnded: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  subscriptionPlan: string;
  setSubscriptionPlan: React.Dispatch<React.SetStateAction<string>>;
  summary: any;
  setSummary: React.Dispatch<React.SetStateAction<any>>;
  summaryFetchLoading: boolean;
  setSummaryFetchLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
}

const SpeechContext = createContext<SpeechContextType>({
  selectedLevel: "",
  setSelectedLevel: () => {},
  selectedPoliteness: "",
  setSelectedPoliteness: () => {},
  selectedTheme: "",
  setSelectedTheme: () => {},
  customTheme: "",
  setCustomTheme: () => {},
  checkGrammarMode: false,
  setCheckGrammarMode: () => {},
  chatId: null,
  setChatId: () => {},
  chatMode: false,
  setChatMode: () => {},
  chatEnded: false,
  setChatEnded: () => {},
  username: "",
  setUsername: () => {},
  subscriptionPlan: "",
  setSubscriptionPlan: () => {},
  summary: null,
  setSummary: () => {},
  summaryFetchLoading: false,
  setSummaryFetchLoading: () => {},
  isMuted: false,
  setIsMuted: () => {},
});

export const SpeechProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedPoliteness, setSelectedPoliteness] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [customTheme, setCustomTheme] = useState<string>("");
  const [checkGrammarMode, setCheckGrammarMode] = useState<boolean>(false);
  const [chatId, setChatId] = useState<number | null>(null);
  const [chatMode, setChatMode] = useState<boolean>(false);
  const [chatEnded, setChatEnded] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string>("");
  const [summary, setSummary] = useState({
    meta: {
      title: "Travel Talk in Japan",
      topic: "Travel and Tourism",
      level: {
        label: "N4",
        reason:
          "Learner can use past tense and descriptive expressions with fair accuracy, but sentence connectors and topic elaboration are limited. This corresponds to N4 ability, where learners can handle everyday topics with simple grammar.",
      },
      time: 6,
    },
    evaluation: {
      summary:
        "The learner discusses a recent trip to Kyoto, describing temples, food, and personal impressions. Responses are enthusiastic but sometimes lack grammatical accuracy and cohesive flow.",
      responseSkill: {
        overall:
          "The learner actively participates, providing relevant answers and showing interest in the topic.",
        reason:
          "Responses directly addressed the partner’s questions but were often short, with few follow-up questions or elaboration.",
        example:
          "When asked 'どんなところが一番好きでしたか？', the learner responded 'きんかくじです！とてもきれいでした。' — a clear and natural answer, though not expanded upon.",
      },
      conversationFlow: {
        rating: "Moderate",
        reason:
          "Conversation progressed smoothly, but transitions between ideas were abrupt (e.g., jumping from temples to food without connectors).",
        example:
          "The learner said 'てらをたくさんみました。たべものはおいしかったです。' — good content, but could be improved with 'それから'.",
      },
      accuracy: {
        grammarMistakes: 4,
        reason:
          "Common mistakes included incorrect conjunctions and adjective conjugations, which are typical at the N4 level.",
        examples: [
          {
            original: "たべものはおいしいでした。",
            correction: "たべものはおいしかったです。",
            note: "Incorrect adjective conjugation; 'おいしい' should become 'おいしかった' in past tense.",
          },
        ],
      },
      vocabularyRange: {
        rating: "Moderate to Good",
        comment:
          "Uses relevant travel-related words ('てら', 'しょくじ', 'おまもり'), but tends to repeat common adjectives like 'たのしい' and 'おいしい'.",
        reason:
          "Shows awareness of topic-specific vocabulary, but limited variation and nuance.",
      },
    },
    feedback: {
      goodPoints: [
        "Strong enthusiasm when describing personal experiences.",
        "Clear understanding of questions about travel and sightseeing.",
        "Good control of basic past tense forms.",
      ],
      commonMistakes: [
        "Incorrect conjunctions ('から' instead of 'ので').",
        "Frequent omission of natural connectors between sentences.",
      ],
      corrections: [
        {
          advice: "Review 'て' and 'ので' forms to connect ideas naturally.",
          before: "たのしかったですから、またいきたいです。",
          after: "たのしかったので、またいきたいです。",
        },
      ],
      sentenceUpgrades: [
        {
          advice:
            "Add emotional reaction to sound more natural and expressive.",
          original: {
            kanji: "きんかくじはきれいでした。",
            kana: "きんかくじ は きれい でした",
          },
          upgraded: {
            kanji: "きんかくじはとてもきれいで、びっくりしました！",
            kana: "きんかくじ は とても きれい で、びっくり しました！",
          },
          reason:
            "Adds a personal emotional element, making the response more engaging.",
        },
      ],
      topicDevelopment: {
        rating: "Developing",
        reason:
          "Can answer questions clearly, but doesn’t expand the conversation by adding new related details or questions.",
      },
      improvementPoints: [
        "Practice combining short sentences with connectors like 'それから', 'そして'.",
        "Use more descriptive adjectives and adverbs to add emotion and detail.",
        "Try explaining *why* you liked or disliked something.",
      ],
    },
    growth: {
      milestone: "Able to describe travel experiences with basic accuracy.",
      currentAbility:
        "Can form complete sentences and recall key vocabulary but still sounds mechanical when connecting ideas.",
      nextLevelGoal:
        "Develop natural transitions and express feelings/opinions more vividly.",
      strengthEnhancement: [
        "Listen to native travel vloggers and note how they connect topics.",
        "Shadow phrases that express surprise or emotion ('びっくりしました', 'すごかったです').",
      ],
      reflectionQuestions: [
        "What surprised you the most during your trip?",
        "Can you describe a moment using feelings and senses (sight, sound, smell)?",
      ],
    },
  });

  const [summaryFetchLoading, setSummaryFetchLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <SpeechContext.Provider
      value={{
        selectedPoliteness,
        setSelectedPoliteness,
        selectedLevel,
        setSelectedLevel,
        selectedTheme,
        setSelectedTheme,
        customTheme,
        setCustomTheme,
        checkGrammarMode,
        setCheckGrammarMode,
        chatId,
        setChatId,
        chatMode,
        setChatMode,
        chatEnded,
        setChatEnded,
        username,
        setUsername,
        subscriptionPlan,
        setSubscriptionPlan,
        summary,
        setSummary,
        summaryFetchLoading,
        setSummaryFetchLoading,
        isMuted,
        setIsMuted,
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = () => useContext(SpeechContext);
