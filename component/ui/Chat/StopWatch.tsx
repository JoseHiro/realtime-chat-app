import React, { useState, useEffect, useRef, useCallback } from "react";
import { Clock } from "lucide-react";
import { apiRequest } from "../../../lib/apiRequest";
import { useSpeech } from "../../../context/SpeechContext";
import { toast } from "sonner";

export interface StopWatchProps {
  history: any;
  setOverlayOpened: React.Dispatch<React.SetStateAction<boolean>> | ((value: boolean) => void);
  chatDurationMinutes: number; // Duration in minutes
}

export function StopWatch({
  history,
  setOverlayOpened,
  chatDurationMinutes,
}: StopWatchProps): JSX.Element {
  const [timeLeft, setTimeLeft] = useState(chatDurationMinutes * 60);
  const [isActive, setIsActive] = useState(true);
  const summaryCreatedRef = useRef(false);

  const {
    selectedPoliteness,
    chatId,
    setChatEnded,
    setChatId,
    setSummary,
    setSummaryFetchLoading,
  } = useSpeech();

  const handleCreateSummary = useCallback(async () => {
    setSummaryFetchLoading(true);
    try {
      const data = await apiRequest("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history,
          chatId,
          politeness: selectedPoliteness,
        }),
      });

      if (data?.status === 204 || !data) {
        setSummary(null);
        toast.info("Not enough conversation", {
          description: "Your conversation was too short to generate a summary.",
          position: "top-center",
        });
      } else {
        setSummary(data);
        toast.success("Summary is ready!", {
          description: "Your conversation summary has been generated.",
          position: "top-center",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error creating summary:", error);
      toast.error("Failed to generate summary", {
        description: "Please try again later.",
        position: "top-center",
      });
    } finally {
      setChatEnded(true);
      setChatId(null);
      setSummaryFetchLoading(false);
    }
  }, [
    history,
    chatId,
    selectedPoliteness,
    setSummaryFetchLoading,
    setSummary,
    setChatEnded,
    setChatId,
  ]);

  // Initialize timeLeft when chatDurationMinutes changes
  useEffect(() => {
    setTimeLeft(chatDurationMinutes * 60);
  }, [chatDurationMinutes]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev == 1) {
            setIsActive(false);
            // 時間切れ時の処理（自動で会話終了）
            if (!summaryCreatedRef.current) {
              summaryCreatedRef.current = true;
              setOverlayOpened(true);
              handleCreateSummary();
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isActive) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, handleCreateSummary, setOverlayOpened]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerBgColor = () => {
    if (timeLeft === 0) return "text-gray-400 border-gray-200";
    if (timeLeft <= 60) return "bg-red-50 border-red-200 text-red-500";
    if (timeLeft <= 120)
      return "bg-orange-50 border-orange-200 text-orange-500";
    return "bg-green-50 border-green-200";
  };

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getTimerBgColor()}`}
    >
      <Clock className={`w-4 h-4`} />
      <span className={`font-mono text-sm font-semibold`}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
