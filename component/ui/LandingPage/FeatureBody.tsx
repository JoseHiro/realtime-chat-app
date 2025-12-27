import React from "react";
import { FeatureCard } from "./FeatureCard";
import { RoundedButton } from "../../button";
import { useRouter } from "next/router";
import Link from "next/link";

export const FeatureBody = () => {
  const router = useRouter();
  return (
    <>
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Why Choose <span className="text-green-600">Kaiwa Kun?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
              Experience the most natural way to learn Japanese through
              conversations that adapt to your skill level and interests.
            </p>
            <Link
              href="/how-it-works"
              className="inline-block text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Learn how it works →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg
                  className="w-6 h-6"
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
              description="Engage in natural Japanese conversations that understand context and respond like a native speaker."
              highlight="3-5 minute sessions"
            />

            <FeatureCard
              icon={
                <svg
                  className="w-6 h-6"
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
                  className="w-6 h-6"
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

      {/* User Feedback Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              What Students Say
            </h2>
            <p className="text-lg text-gray-600">
              Hear from learners who are improving their Japanese with Kaiwa Kun
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex items-start mb-6">
                <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-white font-semibold text-lg">S</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">
                    Sarah M.
                  </h3>
                  <p className="text-sm text-gray-500">Intermediate Learner</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 text-gray-900 fill-current mr-0.5"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-base text-gray-600 leading-relaxed">
                &ldquo;Kaiwa Kun has been amazing for my Japanese practice. The
                conversations feel natural, and the grammar feedback helps me
                understand my mistakes. Highly recommend!&rdquo;
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex items-start mb-6">
                <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-white font-semibold text-lg">T</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">
                    Tomoya K.
                  </h3>
                  <p className="text-sm text-gray-500">Advanced Learner</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 text-gray-900 fill-current mr-0.5"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-base text-gray-600 leading-relaxed">
                &ldquo;As someone preparing for JLPT, the detailed feedback and
                conversation summaries are incredibly valuable. It&apos;s like
                having a personal tutor available anytime.&rdquo;
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex items-start mb-6">
                <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-white font-semibold text-lg">E</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">
                    Emily R.
                  </h3>
                  <p className="text-sm text-gray-500">Beginner Learner</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 text-gray-900 fill-current mr-0.5"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-base text-gray-600 leading-relaxed">
                &ldquo;I was nervous about speaking Japanese, but the platform
                is so supportive. Starting with easy conversations built my
                confidence, and now I&apos;m having longer chats!&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Ready to Master Japanese?
          </h2>
          <p className="text-lg mb-8 text-gray-600">
            Join thousands of learners who are improving their Japanese skills
            through natural conversations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RoundedButton
              onClick={() => router.push("/signup?plan=trial")}
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 hover:scale-105 hover:shadow-lg shadow-md transition-all"
            >
              Start Your Free Trial
            </RoundedButton>
            <RoundedButton
              onClick={() => router.push("/how-it-works")}
              className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold hover:scale-105 transition-all"
            >
              Learn More
            </RoundedButton>
          </div>
        </div>
      </section>
    </>
  );
};
