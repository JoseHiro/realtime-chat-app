/**
 * Realtime "begin conversation" flow for the new-chat page.
 * Used by: pages/new.tsx
 */

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { apiRequest } from "../../../lib/apiRequest";

export interface UseBeginConversationParams {
  needPayment: boolean;
  plan: "pro" | "trial";
  setPaymentOverlay: (open: boolean) => void;
  handleRefreshPreviousData: () => void;
  setChatId: (id: number) => void;
  setChatMode: (mode: boolean) => void;
  setHistory: React.Dispatch<
    React.SetStateAction<{ role: string; content: string }[]>
  >;
  selectedLevel: string;
  selectedTheme: string;
  customTheme: string;
  selectedPoliteness: string;
  selectedTime: number;
  selectedCharacter: string;
}

export function useBeginConversation(params: UseBeginConversationParams) {
  const {
    needPayment,
    plan,
    setPaymentOverlay,
    handleRefreshPreviousData,
    setChatId,
    setChatMode,
    setHistory,
    selectedLevel,
    selectedTheme,
    customTheme,
    selectedPoliteness,
    selectedTime,
    selectedCharacter,
  } = params;

  const [loading, setLoading] = useState(false);
  const dcRef = useRef<RTCDataChannel | null>(null);

  const handleBeginConversation = useCallback(async () => {
    if (needPayment) {
      setPaymentOverlay(true);
      if (plan !== "pro") {
        toast.error("Your trial has ended. Please select a plan to continue.", {
          position: "top-center",
        });
      } else {
        toast.error(
          "Your pro subscription is not active. Please subscribe to continue.",
          {
            position: "top-center",
          },
        );
      }
      return;
    }

    if (loading) return;
    setLoading(true);
    handleRefreshPreviousData();

    try {
      const pc = new RTCPeerConnection();
      const dc = pc.createDataChannel("oai-events");

      dcRef.current = dc;

      dc.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.type === "response.audio_transcript.done") {
          const fullText = msg.transcript;
          console.log("保存するテキスト:", fullText);
          setHistory((prev) => [
            ...prev,
            { role: "assistant", content: fullText },
          ]);
        }
      };

      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;

      pc.ontrack = (event) => {
        console.log("AI audio received");
        audioEl.srcObject = event.streams[0];
      };

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const tokenRes = await fetch("/api/realtime_test", {
        method: "POST",
      });

      const session = await tokenRes.json();
      const EPHEMERAL_KEY = session.client_secret.value;

      const sdpRes = await fetch(
        "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview",
        {
          method: "POST",
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${EPHEMERAL_KEY}`,
            "Content-Type": "application/sdp",
          },
        },
      );

      const answerSDP = await sdpRes.text();
      await pc.setRemoteDescription({
        type: "answer",
        sdp: answerSDP,
      });

      const data = await apiRequest("/api/chat/start-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          level: selectedLevel,
          theme: selectedTheme || customTheme.trim(),
          politeness: selectedPoliteness || "polite",
          characterName: selectedCharacter,
          time: selectedTime,
        }),
      });
      console.log("[Realtime audio] started conversation");

      if (!data.chatId) {
        setChatId(Number(1));
        setChatMode(true);
      } else {
        throw new Error("Failed to create chat - no chatId returned");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to start conversation. Please try again.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  }, [
    needPayment,
    plan,
    selectedLevel,
    selectedTheme,
    customTheme,
    selectedPoliteness,
    selectedTime,
    selectedCharacter,
    loading,
    handleRefreshPreviousData,
    setChatId,
    setChatMode,
    setPaymentOverlay,
    setHistory,
  ]);

  const sendTextMessage = useCallback(
    (text: string) => {
      console.log("[Realtime audio] sending text message:", text);
      if (!dcRef.current || dcRef.current.readyState !== "open") {
        toast.error("まだ接続されていません");
        return;
      }

      const event = {
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text }],
        },
      };

      dcRef.current.send(JSON.stringify(event));
      dcRef.current.send(JSON.stringify({ type: "response.create" }));

      setHistory((prev) => [...prev, { role: "user", content: text }]);
    },
    [setHistory],
  );

  return { handleBeginConversation, sendTextMessage, dcRef, loading };
}
