import React from "react";
import { FeatureCard } from "./FeatureCard";
import { StepCard } from "./StepCard";
import { RoundedButton } from "../../button";
import { useRouter } from "next/router";

export const FeatureBody = () => {
  const router = useRouter();
  return (
    <>
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                Kaiwa Kun?
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
              onClick={() => router.push("/signup?plan=trial")}
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
    </>
  );
};
