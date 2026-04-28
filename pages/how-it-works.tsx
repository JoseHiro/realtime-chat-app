import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { LandingHeader } from "../component/ui/LandingPage/LandingHeader";
import { LandingFooter } from "../component/ui/LandingPage/LandingFooter";
import { RoundedButton } from "../component/shared/button";
import {
  UserPlus,
  Settings,
  Mic,
  BarChart3,
  History,
  ChevronRight,
  Star,
  Coffee,
  Briefcase,
  Plane,
  BookOpen,
  Users,
  CheckCircle2,
  Volume2,
  FileText,
} from "lucide-react";

const HowItWorks = () => {
  const router = useRouter();
  const [stepsVisible, setStepsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStepsVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  const steps = [
    {
      number: 1,
      title: "Sign Up in Seconds",
      description:
        "Create your account with email or Google — no credit card required. You get 3 free conversation sessions to start.",
      icon: UserPlus,
    },
    {
      number: 2,
      title: "Set Up Your Session",
      description:
        "Pick your difficulty (Easy / Medium / Hard), a conversation theme, your AI character, politeness style, and how long you want to talk.",
      icon: Settings,
    },
    {
      number: 3,
      title: "Have a Real Conversation",
      description:
        "Speak naturally in Japanese using your microphone. Your AI partner responds in real-time, keeping the conversation going at your level.",
      icon: Mic,
    },
    {
      number: 4,
      title: "Get Scored Feedback",
      description:
        "After each session, receive a personalized summary with a skill score, grammar corrections, vocabulary tips, and next steps.",
      icon: BarChart3,
    },
    {
      number: 5,
      title: "Track & Keep Practicing",
      description:
        "Check your dashboard for streaks and progress. Review past conversation summaries, practice with flashcards, and build vocabulary.",
      icon: History,
    },
  ];

  const features = [
    {
      title: "3 Difficulty Levels",
      description:
        "Choose Easy, Medium, or Hard based on your Japanese proficiency",
      icon: Star,
    },
    {
      title: "5 Conversation Themes",
      description: "Daily Life, Business, Travel, Culture, and Social topics",
      icon: Coffee,
    },
    {
      title: "Grammar Correction",
      description: "Get real-time feedback on your grammar (Pro feature)",
      icon: CheckCircle2,
    },
    {
      title: "Voice Recognition",
      description: "Natural speech-to-text using advanced voice recognition",
      icon: Mic,
    },
    {
      title: "AI Voice Responses",
      description: "Listen to AI responses with natural Japanese pronunciation",
      icon: Volume2,
    },
    {
      title: "Detailed Summaries",
      description: "Comprehensive analysis after each conversation",
      icon: FileText,
    },
  ];

  const themes = [
    { id: "daily", label: "Daily Life", icon: Coffee },
    { id: "business", label: "Business", icon: Briefcase },
    { id: "travel", label: "Travel", icon: Plane },
    { id: "culture", label: "Culture", icon: BookOpen },
    { id: "social", label: "Social", icon: Users },
  ];

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <LandingHeader />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-white">
        <div className="font-quicksand max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
            How <span className="text-green-600">Kaiwa Kun</span> Works
          </h1>
          <p className="text-md text-gray-500 mb-8 leading-relaxed">
            Learn Japanese naturally through conversations. Follow these simple
            steps to start improving your Japanese skills today.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-3 text-gray-900">Five Simple Steps</h2>
            <p className="text-gray-500">From your first word to fluent conversation</p>
          </div>

          <div className="relative">
            {/* Vertical connecting line — desktop only */}
            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-5 bottom-5 w-px bg-gray-200" />

            <div className="flex flex-col gap-8">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isLeft = idx % 2 === 0;
                return (
                  <div
                    key={step.number}
                    style={{ transitionDelay: `${idx * 120}ms` }}
                    className={`block lg:flex lg:items-center transition-all duration-700 ease-out ${stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  >
                    {/* Card */}
                    <div className={`w-full lg:flex-1 ${isLeft ? "lg:order-1 lg:pr-10" : "lg:order-3 lg:pl-10"}`}>
                      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-default">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                            <Icon className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Step {step.number}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                      </div>
                    </div>

                    {/* Center dot — desktop only */}
                    <div className="hidden lg:flex lg:order-2 w-20 justify-center flex-shrink-0 z-10">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md ring-4 ring-white">
                        <span className="text-white text-sm font-bold">{step.number}</span>
                      </div>
                    </div>

                    {/* Spacer — desktop only */}
                    <div className={`hidden lg:block lg:flex-1 ${isLeft ? "lg:order-3" : "lg:order-1"}`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Key Features
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to master Japanese conversation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-base text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Conversation Themes */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Conversation Themes
            </h2>
            <p className="text-lg text-gray-600">
              Choose topics that interest you and practice real-world scenarios
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {themes.map((theme) => {
              const Icon = theme.icon;
              return (
                <div
                  key={theme.id}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-center"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-gray-900" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {theme.label}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Ready to Start Learning?
          </h2>
          <p className="text-lg mb-8 text-gray-600">
            Join thousands of learners improving their Japanese through natural
            conversations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RoundedButton
              onClick={() => router.push("/signup?plan=trial")}
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 hover:scale-105 hover:shadow-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
              Start Your Free Trial
              <ChevronRight className="w-5 h-5" />
            </RoundedButton>
            <RoundedButton
              onClick={() => router.push("/pricing")}
              className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              View Pricing
              <ChevronRight className="w-5 h-5" />
            </RoundedButton>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default HowItWorks;
