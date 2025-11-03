import React from "react";
import { TrendingUp, Lightbulb } from "lucide-react";
import { SectionContainer, SectionDescription } from "./Container";
import { SectionTitle } from "./SectionTitle";

export const MilestoneContainer = ({ milestone }: { milestone: any }) => {
  return (
    <div className="space-y-6">
      <SectionContainer containerName="Growth Path" icon={TrendingUp}>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <SectionTitle title="Current Milestone" />
              <SectionDescription className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-gray-800 leading-relaxed">
                {milestone.current.milestone}
              </SectionDescription>
            </div>
            <div>
              <SectionTitle title="Current Ability" />
              <SectionDescription>
                {milestone.current.ability}
              </SectionDescription>
            </div>
          </div>

          <div>
            <SectionTitle title="Next Level Goal" />
            <SectionDescription className="bg-green-50 border border-green-100 rounded-lg p-4 text-sm text-gray-800 leading-relaxed">
              {milestone.next.goal}
            </SectionDescription>
          </div>

          {milestone.next.steps.length > 0 && (
            <div>
              <SectionTitle title="Action Steps" icon={Lightbulb} />
              <div className="space-y-2">
                {milestone.next.steps.map((item: any, index: number) => (
                  <SectionDescription
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-xs font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-sm text-gray-800">{item}</span>
                  </SectionDescription>
                ))}
              </div>
            </div>
          )}
        </div>
      </SectionContainer>
    </div>
  );
};

export default MilestoneContainer;
