import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { RoundedButton } from "../component/button";
import { LandingHeader } from "../ui/LandingHeader";

const Index = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();

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

  const FeatureCard = ({
    icon,
    title,
    description,
    highlight,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    highlight: string;
  }) => (
    <div className="group bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-100/50 cursor-pointer">
      <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
      <div className="text-sm text-green-600 font-medium">{highlight}</div>
    </div>
  );

  const StepCard = ({
    number,
    title,
    description,
  }: {
    number: string;
    title: string;
    description: string;
  }) => (
    <div className="text-center group">
      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );

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
            <div className="inline-flex items-center bg-green-50 px-4 py-2 rounded-full text-green-700 text-sm font-medium mb-8 animate-bounce">
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

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <RoundedButton
                onClick={() => router.push("/signin")}
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
          <div className="relative">
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
                    <span className="text-xs">AI is typing...</span>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2">
                <input
                  type="text"
                  placeholder="Type your response..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
                />
                <button className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-200 hover:scale-110">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Feedback Popup */}
            <div className="absolute -right-4 top-1/2 transform translate-x-full -translate-y-1/2 bg-white rounded-xl shadow-lg p-4 max-w-xs border border-green-100 animate-pulse-slow hidden lg:block">
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
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                Kaiwa AI?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the most natural way to learn Japanese through
              AI-powered conversations that adapt to your skill level and
              interests.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  ></path>
                </svg>
              }
              title="Real-Time Conversations"
              description="Engage in natural Japanese conversations with AI that understands context and responds like a native speaker."
              highlight="3-5 minute sessions"
            />

            <FeatureCard
              icon={
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              }
              title="Instant Grammar Feedback"
              description="Get detailed grammar analysis and corrections immediately after each conversation to accelerate your learning."
              highlight="Personalized insights"
            />

            <FeatureCard
              icon={
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  ></path>
                </svg>
              }
              title="Custom Difficulty & Themes"
              description="Choose your skill level and practice topics that interest you, from daily life to business conversations."
              highlight="Beginner to Advanced"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-br from-green-50/50 to-white"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">
              Start improving your Japanese in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Choose Your Level"
              description="Select your Japanese proficiency level and pick a conversation theme that interests you."
            />

            <StepCard
              number="2"
              title="Start Chatting"
              description="Have a natural 3-5 minute conversation with our AI teacher in Japanese."
            />

            <StepCard
              number="3"
              title="Get Feedback"
              description="Receive detailed grammar feedback and tips to improve your Japanese skills."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-400 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 opacity-90"></div>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to Master Japanese?</h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands of learners who are improving their Japanese skills
            with AI-powered conversations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RoundedButton
              onClick={() => router.push("/signin")}
              className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 hover:scale-105 hover:shadow-xl shadow-lg"
            >
              Start Your Free Trial
            </RoundedButton>
            <RoundedButton
              onClick={() => {}}
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:scale-105"
            >
              Learn More
            </RoundedButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">日</span>
                </div>
                <span className="text-xl font-bold">Kaiwa AI</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The most natural way to learn Japanese through AI-powered
                conversations. Practice anytime, anywhere, and improve your
                skills faster than ever.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors duration-200"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Reviews
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Updates
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Kaiwa AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
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
