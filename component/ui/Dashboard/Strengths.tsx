import React from "react";
import { Container } from "./shard/container";
import { CheckCircle2, TrendingUp, Star } from "lucide-react";

const Strengths = () => {
  const strengths = [
    {
      icon: CheckCircle2,
      title: "Grammar Accuracy",
      description: "Your grammar has improved by 15% this month",
      progress: 85,
    },
    {
      icon: TrendingUp,
      title: "Vocabulary Range",
      description: "You're using more diverse vocabulary",
      progress: 72,
    },
    {
      icon: Star,
      title: "Conversation Flow",
      description: "Natural conversation flow is getting better",
      progress: 68,
    },
  ];

  return (
    <Container
      className="bg-white border-none"
      title="Your Strengths"
    >
      <div className="flex flex-col gap-4">
        {strengths.map((strength, index) => {
          const Icon = strength.icon;
          return (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-gray-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    {strength.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    {strength.description}
                  </p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-black h-1.5 rounded-full transition-all"
                      style={{ width: `${strength.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {strength.progress}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default Strengths;
