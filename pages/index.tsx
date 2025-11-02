import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { RoundedButton } from "../component/button";
import { LandingHeader } from "../component/ui/LandingHeader";
import { Mic } from "lucide-react";
import { LandingFooter } from "../component/ui/LandingFooter";
import { FeatureBody } from "../component/ui/LandingPage/FeatureBody";

const chatMessages = [
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

const Index = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(true);
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % chatMessages.length);
        setIsTyping(false);
      }, 1000);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white text-gray-900 overflow-x-hidden">
      {/* Navigation */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div
          className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-white"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(34, 197, 94, 0.1) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl text-green-100 opacity-30 font-light animate-pulse">
            話
          </div>
          <div className="absolute top-40 right-20 text-4xl text-green-100 opacity-20 font-light animate-pulse delay-1000">
            学
          </div>
          <div className="absolute bottom-40 left-20 text-5xl text-green-100 opacity-25 font-light animate-pulse delay-2000">
            練
          </div>
          <div className="absolute bottom-20 right-10 text-3xl text-green-100 opacity-15 font-light animate-pulse delay-3000">
            習
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Column */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-green-50 px-4 py-2 rounded-full text-green-700 text-sm font-medium mb-8 animate-bounce mt-5">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></span>
              AI-Powered Japanese Learning
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
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Practice Japanese naturally with AI-powered conversations. Get
              instant grammar feedback, choose your difficulty level, and
              improve your skills in just 3-5 minutes a day.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12 md:mb-16 justify-center lg:justify-start">
              <RoundedButton
                onClick={() => router.push("/signup?plan=trial")}
                className="group bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
              >
                Start Free Trial
                <svg
                  className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  ></path>
                </svg>
              </RoundedButton>
              <RoundedButton
                onClick={() => router.push("/login")}
                className="border border-green-200 text-green-600 hover:text-green-700 hover:border-green-300 hover:bg-green-50 font-medium px-6 py-3 rounded-full transition-all duration-200"
              >
                Already have an account? Login
              </RoundedButton>
              {/* <button className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Watch Demo
              </button> */}
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="text-green-500 mr-1">✓</span>
                3-5 min sessions
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-1">✓</span>
                Real-time feedback
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-1">✓</span>
                Custom themes
              </div>
            </div>
          </div>

          {/* Right Column - Chat Interface Mockup */}
          <div className="relative min-h-full">
            <div className="bg-white rounded-3xl shadow-2xl p-6 mx-auto max-w-sm relative hover:shadow-3xl transition-shadow duration-300">
              {/* Chat Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">AI</span>
                  </div>
                  <div>
                    <div className="font-semibold">Japanese Sensei</div>
                    <div className="text-xs text-green-500 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                      Online
                    </div>
                  </div>
                </div>
                <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Beginner
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 mb-6 h-48 overflow-hidden">
                {chatMessages
                  .slice(0, currentMessage + 1)
                  .map((message, index) => (
                    <div
                      key={index}
                      className={`transform transition-all duration-500 ${
                        index === currentMessage ? "animate-fade-in-up" : ""
                      }`}
                    >
                      {message.type === "ai" ? (
                        <div
                          className="animate-float"
                          style={{ animationDelay: `${index * 0.5}s` }}
                        >
                          <div className="bg-gray-100 rounded-2xl rounded-bl-md p-3 max-w-xs">
                            <div className="text-sm">{message.text}</div>
                            {message.translation && (
                              <div className="text-xs text-gray-500 mt-1">
                                {message.translation}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          className="flex justify-end animate-float"
                          style={{ animationDelay: `${index * 0.5}s` }}
                        >
                          <div className="bg-green-500 text-white rounded-2xl rounded-br-md p-3 max-w-xs">
                            <div className="text-sm">{message.text}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center space-x-2 text-gray-400 animate-fade-in">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs">AI is thinking...</span>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="pt-4 bg-white border-t border-gray-200">
                <div className="max-w-4xl mx-auto flex items-center justify-center flex-col space-y-4">
                  <p className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg cursor-pointer bg-green-500 hover:bg-green-600 shadow-green-500/30">
                    <Mic className="w-4 h-4 text-white" />
                  </p>
                </div>
              </div>
            </div>

            {/* Feedback Popup */}
            <div className="lg:right-0 lg:block absolute bg-white rounded-xl shadow-lg p-4 max-w-xs border border-green-100 hidden animate-pulse-slow m-auto mt-6">
              <div className="text-xs font-semibold text-green-600 mb-2">
                Grammar Feedback
              </div>
              <div className="text-sm text-gray-700 mb-2">
                {`Great conversation! Here's what to improve:`}
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>• Perfect use of です/ます form</div>
                <div>• Consider using より for comparisons</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeatureBody />

      {/* Footer */}
      <LandingFooter />

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
        .delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
};

export default Index;
