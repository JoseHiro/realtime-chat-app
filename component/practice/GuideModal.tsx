import { useState, useEffect } from "react";

export interface GuideStep {
  title: string;
  body: React.ReactNode;
  targetId?: string;
}

interface GuideModalProps {
  steps: GuideStep[];
  onClose: () => void;
}

const SPOTLIGHT_PADDING = 8;
const SPOTLIGHT_RADIUS = 14;

export function GuideModal({ steps, onClose }: GuideModalProps) {
  const [index, setIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const step = steps[index];
  const isLast = index === steps.length - 1;

  useEffect(() => {
    if (!step.targetId) {
      setSpotlight(null);
      return;
    }
    const el = document.getElementById(step.targetId);
    if (!el) { setSpotlight(null); return; }

    const rect = el.getBoundingClientRect();
    setSpotlight({
      top: rect.top + window.scrollY - SPOTLIGHT_PADDING,
      left: rect.left + window.scrollX - SPOTLIGHT_PADDING,
      width: rect.width + SPOTLIGHT_PADDING * 2,
      height: rect.height + SPOTLIGHT_PADDING * 2,
    });

    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [index, step.targetId]);

  const hasSpotlight = !!spotlight;

  return (
    <div className="fixed inset-0 z-50">
      {/* SVG overlay — full screen with a cutout for the spotlight */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ width: "100%", height: document.documentElement.scrollHeight }}
      >
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {spotlight && (
              <rect
                x={spotlight.left}
                y={spotlight.top}
                width={spotlight.width}
                height={spotlight.height}
                rx={SPOTLIGHT_RADIUS}
                ry={SPOTLIGHT_RADIUS}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={hasSpotlight ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.45)"}
          mask="url(#spotlight-mask)"
        />
        {/* Spotlight border ring */}
        {spotlight && (
          <rect
            x={spotlight.left}
            y={spotlight.top}
            width={spotlight.width}
            height={spotlight.height}
            rx={SPOTLIGHT_RADIUS}
            ry={SPOTLIGHT_RADIUS}
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.4"
          />
        )}
      </svg>

      {/* Backdrop click to close (only non-spotlight areas) */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal card — fixed at bottom */}
      <div className="fixed bottom-6 left-4 right-4 z-51 flex justify-center pointer-events-none">
        <div
          className="w-full max-w-sm bg-white dark:bg-gray-950 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Skip */}
          <div className="flex items-center justify-between px-6 pt-5 pb-0">
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              {index + 1} / {steps.length}
            </p>
            <button
              onClick={onClose}
              className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Skip
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pt-3 pb-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {step.title}
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed space-y-2">
              {step.body}
            </div>
          </div>

          {/* Step dots */}
          <div className="flex justify-center gap-1.5 pb-3">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`rounded-full transition-all ${
                  i === index
                    ? "w-4 h-1.5 bg-gray-900 dark:bg-gray-100"
                    : "w-1.5 h-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-2 px-6 pb-6">
            {index > 0 && (
              <button
                onClick={() => setIndex((i) => i - 1)}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={isLast ? onClose : () => setIndex((i) => i + 1)}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-black dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              {isLast ? "Got it" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
