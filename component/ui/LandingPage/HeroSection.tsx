import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { RoundedButton } from "../../shared/button";
import { LoadingMessage } from "../../loading";
import { Mic, Coffee, User, Volume2 } from "lucide-react";

type ChatMessageType = "ai" | "user";

type ChatMessage = {
  type: ChatMessageType;
  text: string;
  translation?: string;
};

const HERO_CHAT_MESSAGES: ChatMessage[] = [
  {
    type: "ai",
    text: "こんにちは！今日はどうですか？",
    translation: "Hello! How are you today?",
  },
  { type: "user", text: "元気です！ありがとう" },
  {
    type: "ai",
    text: "素晴らしい！何か面白いことはありましたか？",
    translation: "Wonderful! Did anything interesting happen?",
  },
];

const HERO_BADGE_LABEL = "AI-Powered Japanese Learning";

const HERO_FEATURES = [
  "3-5 min sessions",
  "Speaking Skills Feedback",
  "Custom themes",
] as const;

const DECORATIVE_KANJI = [
  { char: "話", className: "top-20 left-10 text-6xl text-green-100 opacity-30 delay-0" },
  { char: "学", className: "top-40 right-20 text-4xl text-green-100 opacity-20 delay-1000" },
  { char: "練", className: "bottom-40 left-20 text-5xl text-green-100 opacity-25 delay-2000" },
  { char: "習", className: "bottom-20 right-10 text-3xl text-green-100 opacity-15 delay-3000" },
] as const;

const MESSAGE_ROTATE_INTERVAL_MS = 4000;
const TYPING_DURATION_MS = 1000;

export function HeroSection() {
  const router = useRouter();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const goToSignup = useCallback(() => {
    router.push("/signup?plan=trial");
  }, [router]);

  const goToLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(true);
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % HERO_CHAT_MESSAGES.length);
        setIsTyping(false);
      }, TYPING_DURATION_MS);
    }, MESSAGE_ROTATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-16"
      aria-label="Hero"
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-white"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(34, 197, 94, 0.1) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {DECORATIVE_KANJI.map(({ char, className }) => (
          <div
            key={char}
            className={`absolute font-light animate-pulse ${className}`}
          >
            {char}
          </div>
        ))}
      </div>

      <div className="font-quicksand max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left: Headline & CTA */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center bg-green-50 px-4 py-2 rounded-full text-green-700 text-sm font-medium mb-8 animate-bounce mt-5">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping" aria-hidden />
            {HERO_BADGE_LABEL}
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Master{" "}
            <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              Japanese
            </span>
            <br />
            Through Real
            <br />
            <span className="relative">
              Conversations
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full" />
            </span>
          </h1>

          <p className="text-md text-gray-400 mb-8 leading-relaxed">
            Practice Japanese naturally with AI-powered conversations. Get instant grammar
            feedback, choose your difficulty level, and improve your skills in just 3-5 minutes a
            day.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 md:mb-16 justify-center lg:justify-start">
            <RoundedButton
              onClick={goToSignup}
              className="group bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
            >
              Start Free Trial
              <svg
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </RoundedButton>
            <RoundedButton onClick={goToLogin} variant="white">
              Already have an account? Login
            </RoundedButton>
          </div>

          <ul className="flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-500 list-none">
            {HERO_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center">
                <span className="text-green-500 mr-1" aria-hidden>✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Chat mockup */}
        <div className="relative min-h-full">
          <div className="bg-white rounded-3xl shadow-2xl p-6 mx-auto max-w-sm relative hover:shadow-3xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200">
                  <Image
                    src="/img/man.jpg"
                    alt=""
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <div className="font-semibold">Japanese Sensei</div>
                  <div className="flex gap-1.5 mt-1">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                      <Coffee className="w-3 h-3 flex-shrink-0" aria-hidden />
                      <span className="font-medium text-xs">Daily Life</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                      <User className="w-3 h-3 flex-shrink-0" aria-hidden />
                      <span className="font-medium text-xs">Casual</span>
                    </div>
                  </div>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Beginner
              </span>
            </div>

            <div className="space-y-4 mb-6 h-48 overflow-hidden" role="log" aria-live="polite">
              {HERO_CHAT_MESSAGES.slice(0, currentMessage + 1).map((message, index) => (
                <div
                  key={`${message.type}-${index}`}
                  className={index === currentMessage ? "animate-fade-in-up" : ""}
                >
                  {message.type === "ai" ? (
                    <div
                      className="animate-float"
                      style={{ animationDelay: `${index * 0.5}s` }}
                    >
                      <div className="bg-gray-100 rounded-2xl rounded-bl-md p-3 max-w-xs relative">
                        <p className="text-sm">{message.text}</p>
                        {message.translation && (
                          <p className="text-xs text-gray-500 mt-1">{message.translation}</p>
                        )}
                        <div className="absolute bottom-2 right-2">
                          <Volume2 className="w-3.5 h-3.5 text-gray-400" aria-hidden />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex justify-end animate-float"
                      style={{ animationDelay: `${index * 0.5}s` }}
                    >
                      <div className="bg-gray-800 text-white rounded-2xl rounded-br-md p-3 max-w-xs">
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && <LoadingMessage characterName="Japanese Sensei" />}
            </div>

            <div className="pt-4 bg-white border-t border-gray-200">
              <div className="max-w-4xl mx-auto flex items-center justify-center flex-col space-y-4">
                <button
                  type="button"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg cursor-pointer bg-green-500 hover:bg-green-600 shadow-green-500/30"
                  aria-label="Voice input"
                >
                  <Mic className="w-4 h-4 text-white" aria-hidden />
                </button>
              </div>
            </div>
          </div>

          <div
            className="lg:right-0 lg:block absolute bg-white rounded-xl shadow-lg p-4 max-w-xs border border-green-100 hidden animate-pulse-slow m-auto mt-6"
            aria-hidden
          >
            <div className="text-xs font-semibold text-green-600 mb-2">Grammar Feedback</div>
            <p className="text-sm text-gray-700 mb-2">
              Great conversation! Here&apos;s what to improve:
            </p>
            <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
              <li>Perfect use of です/ます form</li>
              <li>Consider using より for comparisons</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
