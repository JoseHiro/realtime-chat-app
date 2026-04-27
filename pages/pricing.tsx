import React, { useState } from "react";
import { useRouter } from "next/router";
import { RoundedButton } from "../component/shared/button";
import { LandingHeader } from "../component/ui/LandingPage/LandingHeader";
import { FAQType } from "../types/types";
import { LandingFooter } from "../component/ui/LandingPage/LandingFooter";

const CheckIcon = ({ dim = false }: { dim?: boolean }) => (
  <svg
    className={`w-4 h-4 mr-3 mt-0.5 flex-shrink-0 ${dim ? "text-green-300" : "text-green-500"}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
  </svg>
);

const trialFeatures = [
  "3 conversation sessions",
  "Full grammar & skill feedback",
  "Both AI characters (Sakura & Ken)",
  "All difficulty & politeness levels",
  "4 basic conversation themes",
  "Last 3 conversations in history",
];

// Only what's additional vs trial
const proOnlyFeatures = [
  "Unlimited conversations",
  "All themes + custom scenarios",
  "Full conversation history",
  "Mistake pattern analysis over time",
  "Streak calendar & learning analytics",
  "Custom practice word decks",
  "Unlimited flashcards",
];

const comparisonRows: { label: string; trial: string | boolean; pro: string | boolean }[] = [
  { label: "Conversation sessions",         trial: "3 sessions",    pro: "Unlimited" },
  { label: "Grammar & skill feedback",      trial: true,            pro: true },
  { label: "AI characters (Sakura / Ken)",  trial: true,            pro: true },
  { label: "Difficulty & politeness levels",trial: true,            pro: true },
  { label: "Conversation themes",           trial: "4 basic themes",pro: "All + custom" },
  { label: "Conversation history",          trial: "Last 3 chats",  pro: "Full history" },
  { label: "Mistake pattern analysis",      trial: "Per session",   pro: "Accumulated" },
  { label: "Streak calendar & analytics",   trial: false,           pro: true },
  { label: "Custom practice word decks",    trial: false,           pro: true },
  { label: "Unlimited flashcards",          trial: false,           pro: true },
];

const faqs: FAQType[] = [
  {
    question: "How does the free trial work?",
    answer:
      "You get 3 complete conversation sessions to experience Kaiwa Kun — enough to feel real progress. No credit card required.",
  },
  {
    question: "Why 3 sessions and not more?",
    answer:
      "The first session is for getting used to the interface. Sessions 2 and 3 are where you start to feel improvement and see how feedback compounds over time. That's the 'aha' moment we want you to experience before deciding.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes! You can cancel at any time. You'll keep access until the end of your billing period.",
  },
  {
    question: "What happens after my 3 free conversations?",
    answer:
      "You can subscribe to Pro for $15/month to unlock unlimited conversations and all advanced features.",
  },
  {
    question: "What kind of feedback do I get after each chat?",
    answer:
      "After each session you get a personalized summary with a score, title, and overview. It highlights strengths, points out common mistakes, suggests sentence upgrades, vocabulary improvements, and next steps.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards.",
  },
];

const Pricing = () => {
  const router = useRouter();

  const FAQItem = ({ faq }: { faq: FAQType }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="border border-gray-200 rounded-lg">
        <button
          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-semibold text-gray-900">{faq.question}</span>
          <svg
            className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="px-6 pb-4">
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        )}
      </div>
    );
  };

  const ComparisonCell = ({ value }: { value: string | boolean }) => {
    if (value === true) {
      return (
        <td className="px-6 py-4 text-center">
          <svg className="w-5 h-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </td>
      );
    }
    if (value === false) {
      return (
        <td className="px-6 py-4 text-center">
          <svg className="w-4 h-4 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </td>
      );
    }
    return (
      <td className="px-6 py-4 text-center text-sm text-gray-600">{value}</td>
    );
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <LandingHeader />

      {/* Hero */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-green-50/50 to-white">
        <div className="font-quicksand max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-green-50 px-4 py-2 rounded-full text-green-700 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Simple, Transparent Pricing
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Start Learning{" "}
            <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              Japanese Today
            </span>
          </h1>
          <p className="text-md text-gray-500 mb-12 leading-relaxed max-w-3xl mx-auto">
            Try 3 free conversations — no credit card needed. Then unlock unlimited learning for just $15/month.
          </p>
        </div>
      </section>

      {/* Pricing Cards — 3 column */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6 items-stretch">

            {/* Free Trial */}
            <div className="flex flex-col rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="bg-gray-50 px-7 pt-8 pb-6 border-b border-gray-200">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Free Trial</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                </div>
                <p className="text-sm text-gray-500">No credit card required</p>
              </div>
              <div className="flex flex-col flex-1 px-7 py-6">
                <p className="text-gray-500 text-sm mb-5">
                  Get a feel for real AI Japanese conversation with 3 complete sessions.
                </p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {trialFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <CheckIcon />
                      {feature}
                    </li>
                  ))}
                </ul>
                <RoundedButton
                  onClick={() => router.push("/signup?plan=trial")}
                  className="w-full py-3 font-semibold border-2 border-green-500 text-green-600 hover:bg-green-50 transition-colors duration-200"
                >
                  Start Free Trial
                </RoundedButton>
              </div>
            </div>

            {/* Pro — highlighted */}
            <div className="flex flex-col rounded-2xl overflow-hidden shadow-xl ring-2 ring-green-500 relative">
              <div className="bg-gradient-to-br from-green-700 to-green-500 px-7 pt-8 pb-6 relative">
                <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
                <p className="text-xs font-semibold uppercase tracking-widest text-green-200 mb-3">Pro</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold text-white">$15</span>
                  <span className="text-green-200 text-sm">/month</span>
                </div>
                <p className="text-sm text-green-100">Cancel anytime</p>
              </div>
              <div className="flex flex-col flex-1 px-7 py-6 bg-white">
                <p className="text-gray-500 text-sm mb-4">
                  Everything in Free Trial, plus:
                </p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {proOnlyFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <CheckIcon />
                      {feature}
                    </li>
                  ))}
                </ul>
                <RoundedButton
                  onClick={() => router.push("/signup?plan=pro")}
                  className="w-full py-3 font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
                >
                  Subscribe Now
                </RoundedButton>
              </div>
            </div>

            {/* Premium — Coming Soon */}
            <div className="flex flex-col rounded-2xl overflow-hidden border border-gray-200 shadow-sm opacity-80">
              <div className="bg-gradient-to-br from-gray-800 to-gray-600 px-7 pt-8 pb-6 relative">
                <span className="absolute top-4 right-4 bg-white/10 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                  Coming Soon
                </span>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Premium</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold text-white">TBD</span>
                </div>
                <p className="text-sm text-gray-400">Advanced features</p>
              </div>
              <div className="flex flex-col flex-1 px-7 py-6 bg-white">
                <p className="text-gray-400 text-sm mb-4">
                  Everything in Pro, plus:
                </p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {[
                    "Business Japanese scenarios",
                    "Job interview preparation",
                    "Realistic situation role plays",
                    "Anki Deck flashcard export",
                    "Pronunciation practice",
                    "Advanced grammar explanations",
                    "Multiple AI voices",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-400">
                      <CheckIcon dim />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  disabled
                  className="w-full py-3 font-semibold rounded-xl border-2 border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                >
                  Coming Soon
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Compare Plans</h2>
            <p className="text-gray-600">See exactly what you get at each tier</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-gray-500 text-sm font-medium w-1/2">Feature</th>
                  <th className="px-6 py-4 text-center text-gray-700 font-semibold">Free Trial</th>
                  <th className="px-6 py-4 text-center text-green-600 font-semibold">Pro</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 text-gray-700 text-sm">{row.label}</td>
                    <ComparisonCell value={row.trial} />
                    <ComparisonCell value={row.pro} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about our pricing and features</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-400 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Speaking Japanese?</h2>
          <p className="text-xl mb-8 text-green-100">
            Try 3 conversations for free, then continue your journey for just $15/month.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RoundedButton
              onClick={() => router.push("/signup?plan=trial")}
              className="bg-white text-green-600 px-8 py-4 text-lg font-semibold hover:bg-gray-50 hover:scale-105 hover:shadow-xl shadow-lg transition-all duration-200"
            >
              Start Free Trial
            </RoundedButton>
            <RoundedButton
              onClick={() => router.push("/chat")}
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-200"
            >
              Try Demo
            </RoundedButton>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default Pricing;
