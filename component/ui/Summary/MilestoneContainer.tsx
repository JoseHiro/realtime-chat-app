import React from "react";
import { TrendingUp } from "lucide-react";
import { SectionContainer, SectionDescription } from "./Container";
import { SectionTitle } from "./SectionTitle";

export const MilestoneContainer = React.memo(
  ({ milestone }: { milestone: any }) => {
    return (
      <div className="space-y-6">
        <SectionContainer containerName="Growth Path" icon={TrendingUp}>
          <div className="space-y-6">
            <div>
              <SectionDescription className="bg-green-50 border border-green-100 rounded-lg p-4 text-sm text-gray-800 leading-relaxed">
                {milestone.next.goal}
              </SectionDescription>
            </div>
          </div>
        </SectionContainer>
      </div>
    );
  }
);

MilestoneContainer.displayName = "MilestoneContainer";

export default MilestoneContainer;
