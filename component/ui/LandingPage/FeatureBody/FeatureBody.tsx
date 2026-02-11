import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type FeatureItem = {
  title: string;
  description: string;
  highlight: string;
  image: string;
};

const FEATURES: FeatureItem[] = [
  {
    title: "Real-Time Conversations",
    description:
      "Engage in natural Japanese conversations that understand context and respond like a native speaker.",
    highlight: "3-5 minute sessions",
    image: "/img/LP/RealTimeChatImg.png",
  },
  {
    title: "Instant Grammar Feedback",
    description:
      "Get detailed grammar analysis and corrections immediately after each conversation to accelerate your learning.",
    highlight: "Personalized insights",
    image: "/img/LP/FeedbackImg.png",
  },
  {
    title: "Custom Difficulty & Themes",
    description:
      "Choose your skill level and practice topics that interest you, from daily life to business conversations.",
    highlight: "Beginner to Advanced",
    image: "/img/LP/DifficultyThemes.png",
  },
];

const featureBtnClass = (selected: number, i: number) =>
  `rounded-lg transition-all duration-200 ${
    selected === i ? "shadow-lg ring-offset-2 opacity-100 grayscale-0" : "opacity-70 grayscale hover:opacity-90"
  }`;

export const FeatureBody = () => {
  const [selected, setSelected] = useState(0);
  return (
    <>
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="font-quicksand text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Why Choose <span className="text-green-600">Kaiwa Kun?</span>
            </h2>
            <p className="text-sm text-gray-600 max-w-3xl mx-auto mb-4">
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

          <div className="grid md:grid-cols-2 gap-8 ">
            <div className="flex flex-col justify-center items-center gap-4">
              <button
                type="button"
                onClick={() => setSelected(0)}
                className={featureBtnClass(selected, 0)}
                aria-pressed={selected === 0}
                aria-label={`Select ${FEATURES[0].title}`}
              >
                <Image
                  src={FEATURES[0].image}
                  alt={FEATURES[0].title}
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </button>
              <div className="grid grid-cols-2 gap-4">
                {FEATURES.slice(1).map((feature, i) => (
                  <button
                    key={feature.title}
                    type="button"
                    onClick={() => setSelected(i + 1)}
                    className={featureBtnClass(selected, i + 1)}
                    aria-pressed={selected === i + 1}
                    aria-label={`Select ${feature.title}`}
                  >
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center text-left max-w-lg">
              <h3 className="font-quicksand text-2xl font-bold text-gray-900 mb-3">
                {FEATURES[selected].title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed mb-5">
                {FEATURES[selected].description}
              </p>
              <span className="inline-block text-xs font-semibold text-green-600 uppercase tracking-wider bg-green-50 px-3 py-1.5 rounded-full w-fit">
                {FEATURES[selected].highlight}
              </span>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};
