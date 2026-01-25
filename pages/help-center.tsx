import React, { useState } from "react";
import { LandingHeader } from "../component/ui/LandingPage/LandingHeader";
import { LandingFooter } from "../component/ui/LandingPage/LandingFooter";
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  Settings,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

const HelpCenter = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const faqs = [
    {
      category: "Getting Started",
      icon: Settings,
      questions: [
        {
          q: "How do I create an account?",
          a: "Click the 'Start Learning' or 'Sign Up' button on our homepage. You'll need to provide an email address and create a password. No credit card is required for the free trial.",
        },
        {
          q: "What's included in the free trial?",
          a: "The free trial includes 2 full conversation sessions with access to all difficulty levels, grammar feedback, and standard conversation themes.",
        },
        {
          q: "How do I start my first conversation?",
          a: "After signing up and selecting your preferences (level, theme, speaking style), click 'Start Conversation'. Press and hold the microphone button to speak in Japanese.",
        },
      ],
    },
    {
      category: "Using the Platform",
      icon: MessageCircle,
      questions: [
        {
          q: "How do I use voice input?",
          a: "Press and hold the microphone button while speaking. Release the button when you're done speaking. Your speech will be transcribed and sent to the AI teacher.",
        },
        {
          q: "How long should conversations be?",
          a: "Conversations typically last 3-5 minutes. You can end the conversation at any time, but longer conversations provide better feedback and summaries.",
        },
        {
          q: "Can I review past conversations?",
          a: "Yes! All your past conversations are saved in the sidebar. Click on any conversation to review it, read the summary, and see grammar feedback.",
        },
        {
          q: "How do I change my conversation settings?",
          a: "You can change your level, theme, politeness level, and other settings on the mode selection screen before starting a new conversation.",
        },
      ],
    },
    {
      category: "Subscription & Billing",
      icon: CreditCard,
      questions: [
        {
          q: "How does the Pro subscription work?",
          a: "The Pro subscription gives you unlimited conversations, access to all themes including custom themes, grammar correction during conversations, and advanced features. It's billed monthly.",
        },
        {
          q: "Can I cancel my subscription?",
          a: "Yes, you can cancel your subscription at any time from your account settings. Your subscription will remain active until the end of the current billing period.",
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards through our secure payment processor, Stripe.",
        },
        {
          q: "Is my payment information secure?",
          a: "Yes, all payments are processed securely through Stripe. We do not store your full credit card information on our servers.",
        },
      ],
    },
    {
      category: "Technical Issues",
      icon: Settings,
      questions: [
        {
          q: "The microphone isn't working",
          a: "Make sure you've granted microphone permissions in your browser settings. Try refreshing the page or using a different browser (Chrome or Edge work best).",
        },
        {
          q: "I'm not hearing the AI responses",
          a: "Check your device volume and browser audio settings. Make sure audio is not muted in your browser or device.",
        },
        {
          q: "The page is loading slowly",
          a: "Try refreshing the page or clearing your browser cache. If the issue persists, it may be a temporary server issue. Please try again later.",
        },
        {
          q: "My conversation data seems incorrect",
          a: "If you notice any issues with your conversation history or summaries, please contact our support team and we'll investigate.",
        },
      ],
    },
  ];

  const toggleSection = (category: string) => {
    setOpenSection(openSection === category ? null : category);
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <LandingHeader />

      <section className="pt-24 pb-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              Help Center
            </h1>
            <p className="text-lg text-gray-600">
              Find answers to common questions and learn how to get the most out
              of Kaiwa Kun
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            <Link
              href="/how-it-works"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-md transition-all"
            >
              <BookOpen className="w-8 h-8 text-gray-900 mb-3" />
              <h3 className="font-semibold text-lg mb-2 text-gray-900">
                How It Works
              </h3>
              <p className="text-sm text-gray-600">
                Learn about our platform and features
              </p>
            </Link>
            <Link
              href="/pricing"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-md transition-all"
            >
              <CreditCard className="w-8 h-8 text-gray-900 mb-3" />
              <h3 className="font-semibold text-lg mb-2 text-gray-900">
                Pricing
              </h3>
              <p className="text-sm text-gray-600">
                View our subscription plans
              </p>
            </Link>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-4">
            {faqs.map((section) => {
              const Icon = section.icon;
              const isOpen = openSection === section.category;
              return (
                <div
                  key={section.category}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection(section.category)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Icon className="w-6 h-6 text-gray-900" />
                      <h2 className="text-xl font-semibold text-gray-900">
                        {section.category}
                      </h2>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="border-t border-gray-200 px-6 py-4">
                      <div className="space-y-6">
                        {section.questions.map((faq, idx) => (
                          <div key={idx}>
                            <h3 className="font-semibold text-lg mb-2 text-gray-900">
                              {faq.q}
                            </h3>
                            <p className="text-base text-gray-600 leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default HelpCenter;
