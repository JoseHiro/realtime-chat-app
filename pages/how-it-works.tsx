import React from "react";
import { useRouter } from "next/router";
import { LandingHeader } from "../component/ui/LandingHeader";
import { LandingFooter } from "../component/ui/LandingFooter";
import { RoundedButton } from "../component/button";
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

  const steps = [
    {
      number: 1,
      title: "Sign Up & Get Started",
      description: "Create your free account and start with 2 free conversation sessions to try out all features.",
      icon: UserPlus,
      details: [
        "Quick signup with email",
        "2 free trial conversations",
        "No credit card required",
        "Access to all difficulty levels",
      ],
    },
    {
      number: 2,
      title: "Choose Your Settings",
      description: "Customize your conversation experience by selecting your Japanese level, conversation theme, speaking style, and more.",
      icon: Settings,
      details: [
        "Japanese Level: Easy (初級), Medium (中級), or Hard (上級)",
        "Conversation Theme: Daily Life (all users), other themes require Pro",
        "Speaking Style: Polite (です/ます) or Casual (だ/である)",
        "Grammar Correction: Real-time feedback during conversation (Pro feature)",
        "Custom Themes: Create your own conversation scenarios (Pro feature)",
        "Voice Gender: Choose male or female AI voice",
      ],
    },
    {
      number: 3,
      title: "Start Your Conversation",
      description: "Have a natural 3-5 minute conversation with our AI teacher in Japanese using voice input.",
      icon: Mic,
      details: [
        "Press and hold the microphone button to speak",
        "Speak naturally in Japanese",
        "AI responds with appropriate difficulty level",
        "Conversations typically last 3-5 minutes",
        "Real-time transcription of your speech",
      ],
    },
    {
      number: 4,
      title: "Get Detailed Feedback",
      description: "After each conversation, receive comprehensive analysis including grammar corrections, vocabulary suggestions, and conversation insights.",
      icon: BarChart3,
      details: [
        "Grammar Analysis: Corrections and explanations",
        "Conversation Skills: Fluency, accuracy, and engagement",
        "Vocabulary Usage: Words you used and suggestions",
        "Milestones: Track your progress over time",
      ],
    },
    {
      number: 5,
      title: "Review & Practice",
      description: "Access your conversation history anytime to review past conversations, summaries, and track your improvement.",
      icon: History,
      details: [
        "View all past conversations",
        "Re-read summaries and feedback",
        "Track progress over time",
        "Search conversations by title",
        "Edit conversation titles",
      ],
    },
  ];

  const features = [
    {
      title: "3 Difficulty Levels",
      description: "Choose Easy, Medium, or Hard based on your Japanese proficiency",
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
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
            How <span className="text-green-600">Kaiwa Kun</span> Works
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Learn Japanese naturally through conversations. Follow these simple steps
            to start improving your Japanese skills today.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex gap-8">
                  {/* Number Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-900">{step.number}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-gray-900" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
                    </div>
                    <p className="text-base text-gray-600 mb-6 leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-base text-gray-600">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Key Features</h2>
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
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-base text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trial Limitations */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 lg:p-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Free Trial Limitations</h2>
            <p className="text-base text-gray-600 mb-6">
              The free trial includes 2 conversation sessions with access to core features. Some features are available only with a Pro subscription:
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 flex-shrink-0" />
                <span className="text-base text-gray-600"><strong className="text-gray-900">Limited to 2 conversations</strong> - Free trial allows 2 complete conversation sessions</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 flex-shrink-0" />
                <span className="text-base text-gray-600"><strong className="text-gray-900">Only Daily Life theme</strong> - Other themes (Business, Travel, Culture, Social) require Pro</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 flex-shrink-0" />
                <span className="text-base text-gray-600"><strong className="text-gray-900">No custom themes</strong> - Create your own conversation scenarios with Pro</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 flex-shrink-0" />
                <span className="text-base text-gray-600"><strong className="text-gray-900">Grammar correction during conversations</strong> - Real-time feedback is a Pro feature</span>
              </li>
            </ul>
            <div className="pt-6 border-t border-gray-200">
              <p className="text-base text-gray-600 mb-4">
                Ready to unlock all features? Upgrade to Pro for unlimited conversations and advanced learning tools.
              </p>
              <RoundedButton
                onClick={() => router.push("/pricing")}
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-colors inline-block"
              >
                View Pricing Plans
              </RoundedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Conversation Themes */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Conversation Themes</h2>
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
                  <h3 className="text-lg font-semibold text-gray-900">{theme.label}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Tips for Success</h2>
            <p className="text-lg text-gray-600">
              Get the most out of your Japanese learning experience
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-8 lg:p-12">
            <ul className="space-y-8">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">
                    Start with Easy Level
                  </h3>
                  <p className="text-base text-gray-600">
                    Even if you're intermediate, starting with Easy helps you get comfortable with
                    the interface and build confidence.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">
                    Speak Naturally
                  </h3>
                  <p className="text-base text-gray-600">
                    Don't worry about making mistakes. The AI will understand you, and you'll get
                    feedback to improve. Focus on communicating your thoughts naturally.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">
                    Review Your Feedback
                  </h3>
                  <p className="text-base text-gray-600">
                    After each conversation, take time to read the summary and grammar corrections.
                    This helps you learn from your mistakes and improve faster.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">Practice Regularly</h3>
                  <p className="text-base text-gray-600">
                    Consistency is key. Try to have at least 2-3 conversations per week to see
                    significant improvement in your Japanese skills.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-sm">5</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">
                    Try Different Themes
                  </h3>
                  <p className="text-base text-gray-600">
                    Experiment with various conversation themes to expand your vocabulary and
                    practice different types of scenarios you might encounter in real life.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Ready to Start Learning?</h2>
          <p className="text-lg mb-8 text-gray-600">
            Join thousands of learners improving their Japanese through natural conversations
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
