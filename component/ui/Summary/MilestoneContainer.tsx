import React from "react";

export const MilestoneContainer = React.memo(
  ({ milestone }: { milestone: any }) => {
    if (!milestone?.next?.goal) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 px-6 py-8 text-center">
          <p className="text-sm text-gray-500">No growth path data available.</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
        <div className="px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Growth Path
          </p>
          <div className="flex items-start gap-3">
            <span className="mt-1.5 w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            <p className="text-sm text-gray-800 leading-relaxed">
              {milestone.next.goal}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

MilestoneContainer.displayName = "MilestoneContainer";

export default MilestoneContainer;
