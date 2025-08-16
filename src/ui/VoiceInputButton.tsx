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

export const VoiceInput = ({
  chatLoading,
  setChatLoading,
  setHistory,
  sendToAPI,
}: {
  history: any;
  chatLoading: boolean;
  audioList: any;
  setChatLoading: (loading: boolean) => void;
  setHistory: (history: any) => void;
  setAudioList: (audioList: any) => void;
  sendToAPI: (text: string) => Promise<void>;
}) => {
  const [isRecording, setIsRecording] = useState(false);
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
      const lastResult = event.results[event.results.length - 1];
      const transcriptText = lastResult[0].transcript;

      // 確定したときだけ送信
      if (lastResult.isFinal) {
        console.log("Transcript:", transcriptText);
        handleSubmitAudio(transcriptText);
      }
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
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
  };

  const handleSubmitAudio = async (text) => {
    if (!text.trim()) {
      return;
    }
    setHistory((prev) => {
      const newMessages = [...prev, { role: "user", content: text }];
      sendToAPI(newMessages);
      return newMessages;
    });
  };

  const handleDemoSubmit = (text) => {
    if (!text.trim()) return;
    setHistory((prev) => {
      const newMessages = [...prev, { role: "user", content: text }];
      sendToAPI(newMessages);
      return newMessages;
    });
    setText("");
  };

  const [text, setText] = useState("");
  return (
    <div className="p-4 lg:p-6 bg-white border-t border-gray-200">
      <input
        type="text"
        value={text}
        className="border border-gray-300 rounded-lg p-2 w-full mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="音声入力はボタンを押して開始"
        onChange={(e) => setText(e.target.value)}
        onFocus={() => {
          if (isRecording) {
            stopRecording();
          }
        }}
      />
      <button
        onClick={() => handleDemoSubmit(text)}
        className="border rounded-lg p-2 text-black"
      >
        Submit
      </button>
      <div className="max-w-4xl mx-auto flex items-center justify-center flex-col space-y-4">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
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
        <p className="text-sm text-gray-500">
          Please speak while pressing the button. Release to stop.
        </p>
      </div>
    </div>
  );
};
