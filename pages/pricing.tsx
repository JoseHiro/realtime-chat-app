import React, { useState } from "react";
import { useRouter } from "next/router";
import { RoundedButton } from "../component/shared/button";
import { LandingHeader } from "../component/ui/LandingPage/LandingHeader";
import { PricingType, FAQType } from "../types/types";
import { LandingFooter } from "../component/ui/LandingPage/LandingFooter";

const Pricing = () => {
  const router = useRouter();
  const plans: PricingType[] = [
    {
      name: "Free Trial",
      type: "trial",
      description: "Try Kaiwa Kun with 2 free conversation sessions",
      price: 0,
      features: [
        "2 conversation sessions",
        "Grammar feedback",
        "Conversation skill feedback",
        "All difficulty levels",
        "Standard conversation themes",
      ],
      limitations: [
        "Limited to 2 conversations total",
        "No advanced analytics",
        "Limited Conversation themes",
      ],
      buttonText: "Start Free Trial",
      buttonStyle: "border-2 border-green-500 text-green-600 hover:bg-green-50",
      popular: false,
      color: "green",
      badge: null,
    },
    {
      name: "Pro",
      type: "pro",
      description: "Unlimited conversations for serious Japanese learners",
      price: 15,
      features: [
        "Unlimited conversations",
        "Grammar feedback",
        "Conversation skill feedback",
        "All difficulty levels",
        "Various conversation themes",
        "Custom conversation scenarios",
        "Mistake pattern analysis",
      ],
      limitations: [],
      buttonText: "Subscribe Now",
      buttonStyle: "bg-green-500 hover:bg-green-600 text-white",
      popular: true,
      color: "green",
      badge: "Most Popular",
    },
    {
      name: "Premium",
      type: "premium",
      description: "Advanced features for professional Japanese mastery",
      price: null,
      features: [
        "Everything in Pro",
        "Business Japanese scenarios",
        "Job interview preparation",
        "Realistic situation role plays",
        "Anki Deck flashcard download",
        "Pronunciation Practice",
        "Grammar Exercises",
        "Grammar Explanations",
        "Different AI voices Selection",
      ],
      limitations: [],
      buttonText: "Coming Soon",
      buttonStyle: "bg-gray-300 text-gray-500 cursor-not-allowed",
      popular: false,
      color: "gray",
      badge: "Coming Soon",
      disabled: true,
    },
  ];

  const faqs = [
    {
      question: "How does the free trial work?",
      answer:
        "You get 2 complete conversation sessions to experience Kaiwa Kun. No credit card required to start your trial.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.",
    },
    {
      question: "What happens after my 2 free conversations?",
      answer:
        "After your free trial, you'll need to subscribe to the Pro plan for $15/month to continue having unlimited conversations.",
    },
    {
      question: "What kind of feedbacks do you get after each chat?",
      answer:
        "After each chat, you receive a personalized summary that includes your score, a title, and a short overview. It highlights your strengths, points out common mistakes, and suggests improvements. You’ll also get example sentence upgrades, vocabulary suggestions, and advice to help develop your conversational skills step by step.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept accept credit cards.",
    },
    {
      question: "When will Premium features be available?",
      answer:
        "Premium features are currently in development. We'll notify all users when these advanced features become available.",
    },
  ];

  const PricingCard = ({ plan }: { plan: PricingType }) => (
    <div
      className={`relative ${plan.popular ? "transform scale-105 z-10" : ""}`}
    >
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-50">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
              plan.badge === "Most Popular"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
            }`}
          >
            {plan.badge}
          </span>
        </div>
      )}

      <div
        className={`bg-white rounded-2xl shadow-xl p-8 h-full border-2 transition-all duration-300 hover:shadow-2xl ${
          plan.popular
            ? "border-green-500"
            : plan.disabled
              ? "border-gray-200"
              : "border-gray-100 hover:border-green-200"
        } ${plan.disabled ? "opacity-75" : ""}`}
      >
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <p className="text-gray-600 mb-6">{plan.description}</p>

          <div className="mb-6">
            <div className="flex items-baseline justify-center">
              {plan.price === null ? (
                <span className="text-3xl font-bold text-gray-500">TBD</span>
              ) : (
                <>
                  <span className="text-5xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-500 ml-1">/month</span>
                  )}
                </>
              )}
            </div>
            {plan.price === 0 && (
              <span className="text-gray-500">No credit card required</span>
            )}
          </div>

          <RoundedButton
            onClick={() => {
              if (!plan.disabled) {
                console.log("hellooooo");

                router.push(`/signup?plan=${plan.type}`);
              }
            }}
            className={`w-full py-4 text-lg font-semibold transition-all duration-200 ${
              plan.disabled ? "" : "hover:scale-105"
            } shadow-lg ${plan.buttonStyle}`}
            disabled={plan.disabled}
          >
            {plan.buttonText}
          </RoundedButton>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 text-lg">
            {`What's included:`}
          </h4>
          <ul className="space-y-3">
            {plan.features.map((feature, idx: number) => (
              <li key={idx} className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          {plan.limitations.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h4 className="font-semibold text-gray-500 text-sm mb-3">
                Limitations:
              </h4>
              <ul className="space-y-2">
                {plan.limitations.map((limitation, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <svg
                      className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                    <span className="text-gray-500 text-sm">{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
            className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
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

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Navigation */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-green-50/50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-green-50 px-4 py-2 rounded-full text-green-700 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Simple, Transparent Pricing
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Start Learning{" "}
            <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              Japanese Today
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Begin with 2 free conversations, then unlock unlimited learning for
            just $15/month. No long-term commitments, cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing and features
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-400 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Speaking Japanese?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Try 2 conversations for free, then continue your journey for just
            $15/month.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RoundedButton
              onClick={() => router.push("/signup?plan=trial")}
              className="bg-white text-green-600 px-8 py-4 text-lg font-semibold hover:bg-gray-50 hover:scale-105 hover:shadow-xl shadow-lg transition-all duration-200"
            >
              Start Free Trial
            </RoundedButton>
            <RoundedButton
              onClick={() => router.push("/new_chat")}
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-200"
            >
              Try Demo
            </RoundedButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default Pricing;
