import React, { useState, useEffect, useRef } from "react";
import { Mic, Square } from "lucide-react";

// Type declarations for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

type SpeechRecognition = typeof window.SpeechRecognition extends undefined
  ? any
  : InstanceType<typeof window.SpeechRecognition>;

export const VoiceInput = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isAITalking] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("ブラウザが音声認識に対応していません");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ja-JP";
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1][0].transcript;
      console.log("Transcript:", result);
      setTranscript(result);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) return;
    setIsRecording(true);
    setTranscript("");
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
  };

  return (
    <button
      onMouseDown={startRecording}
      onMouseUp={startRecording}
      onTouchStart={startRecording}
      onTouchEnd={stopRecording}
      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg cursor-pointer ${
        isRecording
          ? "bg-red-500 scale-110 shadow-red-500/30"
          : "bg-green-500 hover:bg-green-600 shadow-green-500/30"
      } ${isAITalking ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={isAITalking}
    >
      {isRecording ? (
        <Square className="w-8 h-8 text-white" />
      ) : (
        <Mic className="w-8 h-8 text-white" />
      )}
    </button>
  );
};
