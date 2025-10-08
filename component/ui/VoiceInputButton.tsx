import React, { useState, useRef } from "react";
import { Mic, Square } from "lucide-react";
import { ChatType } from "../../type/types";
import { useSpeech } from "../../context/SpeechContext";
import { toast } from "sonner";

// Type declarations for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type SpeechRecognition = typeof window.SpeechRecognition extends undefined
  ? any
  : InstanceType<typeof window.SpeechRecognition>;

export const VoiceInput = ({
  setHistory,
  sendToAPI,
  history,
  setHiraganaReadingList,
  setChatInfo,
}: {
  setHistory: React.Dispatch<React.SetStateAction<ChatType>>;
  sendToAPI: (text: ChatType) => Promise<void>;
  history: ChatType;
  setChatInfo: React.Dispatch<
    React.SetStateAction<{ audioUrl: string; english: string }[]>
  >;
  setHiraganaReadingList: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isAITalking] = useState(false);
  const { chatEnded } = useSpeech();

  const initRecognition = () => {
    if (recognitionRef.current) return recognitionRef.current;
    if (typeof window === "undefined") return null;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("ブラウザが音声認識に対応していません");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ja-JP";
    recognition.interimResults = true;
    recognition.onresult = (event: any) => {
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        handleDemoSubmit(lastResult[0].transcript);
      }
    };
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    return recognition;
  };
  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //   if (recognitionRef.current) return;

  //   const SpeechRecognition =
  //     window.SpeechRecognition || window.webkitSpeechRecognition;
  //   if (!SpeechRecognition) {
  //     toast.error("ブラウザが音声認識に対応していません");
  //     return;
  //   }

  //   const recognition = new SpeechRecognition();
  //   recognition.lang = "ja-JP";
  //   recognition.interimResults = true;

  //   recognition.onresult = (event: any) => {
  //     const lastResult = event.results[event.results.length - 1];
  //     const transcriptText = lastResult[0].transcript;

  //     // 確定したときだけ送信
  //     if (lastResult.isFinal) {
  //       handleDemoSubmit(transcriptText);
  //     }
  //   };

  //   recognition.onend = () => {
  //     setIsRecording(false);
  //   };

  //   recognitionRef.current = recognition;
  // }, []);

  const startRecording = () => {
    const recognition = initRecognition();
    if (!recognition || isRecording) return;
    setIsRecording(true);
    recognition.start();
  };
  // const startRecording = () => {
  //   if (!recognitionRef.current) return;
  //   if (isRecording) return;
  //   setIsRecording(true);
  //   recognitionRef.current.start();
  // };

  const stopRecording = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
  };

  // voice input
  const handleSubmitAudio = async (text: string) => {
    if (!text.trim()) return;
    const latesMessageHistory = [...history, { role: "user", content: text }];

    setHistory((prev) => [...prev, { role: "user", content: text }]);
    setHiraganaReadingList((prev) => [...prev, ""]);
    setChatInfo((prev) => [...prev, { audioUrl: "", english: "" }]);

    // 最新の state を sendToAPI 側で使うのでここは引数不要
    sendToAPI(latesMessageHistory);
  };

  // text input
  const handleDemoSubmit = (text: string) => {
    if (!text.trim()) return;

    const latesMessageHistory = [...history, { role: "user", content: text }];

    setHistory((prev) => [...prev, { role: "user", content: text }]);
    setHiraganaReadingList((prev) => [...prev, ""]);
    setChatInfo((prev) => [...prev, { audioUrl: "", english: "" }]);

    // 最新の state を sendToAPI 側で使うのでここは引数不要
    sendToAPI(latesMessageHistory);
    setText("");
  };

  const [text, setText] = useState("");

  return (
    <div className="p-4 lg:p-6 bg-white border-t border-gray-200">
      {!chatEnded ? (
        <>
          {process.env.NODE_ENV === "development" && (
            <>
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
            </>
          )}
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
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="text-4xl">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800">
            Chat Session Finished!
          </h2>
          <p className="text-gray-600">
            Thank you for chatting. Hope you enjoyed the conversation!
          </p>
        </div>
      )}
    </div>
  );
};
