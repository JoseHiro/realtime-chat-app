import React from "react";
import { Lock, Edit3, Plus } from "lucide-react";
import { toast } from "sonner";
import { IoIosColorPalette } from "react-icons/io";

type Theme = {
  id: string;
  label: string;
  description: string;
  imgURL: string;
  icon: string;
};

type ThemeSelectionProps = {
  themes: Theme[];
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  customTheme: string;
  setCustomTheme: (theme: string) => void;
  isProUser: boolean;
  setPaymentOverlay: (show: boolean) => void;
  iconMap: Record<string, React.ElementType>;
};

export const ThemeSelection = ({
  themes,
  selectedTheme,
  setSelectedTheme,
  customTheme,
  setCustomTheme,
  isProUser,
  setPaymentOverlay,
  iconMap,
}: ThemeSelectionProps) => {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-center gap-2">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
            Conversation Theme
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Choose a topic for your conversation
          </p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2">
          <IoIosColorPalette className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => {
          const IconComponent = iconMap[theme.icon];
          const isSelected = selectedTheme === theme.id;
          const isLocked = !isProUser && theme.id !== "daily";

          return (
            <div
              key={theme.id}
              onClick={() => {
                if (isLocked) {
                  setPaymentOverlay(true);
                  toast.info("Upgrade to Pro to unlock all themes!", {
                    position: "top-center",
                  });
                  return;
                }
                setSelectedTheme(theme.id);
              }}
              className={`relative rounded-lg overflow-hidden border transition-all ${
                isLocked
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
              } ${
                isSelected
                  ? "border-gray-900 dark:border-gray-300 bg-gray-50 dark:bg-gray-800"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              }`}
            >
              <div className="relative h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={theme.imgURL}
                  alt={theme.label}
                  className="w-full h-full object-cover"
                />
                {isLocked && (
                  <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 mb-2">
                        <Lock className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Pro Only
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPaymentOverlay(true);
                        }}
                        className="px-3 py-1.5 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 text-xs font-medium rounded transition-colors"
                      >
                        Upgrade
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {theme.label}
                  </h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {theme.description}
                </p>
              </div>
            </div>
          );
        })}

        {/* Custom Theme */}
        <div
          className={`relative rounded-lg overflow-hidden border transition-all ${
            !isProUser
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
          } ${
            customTheme.trim()
              ? "border-gray-900 dark:border-gray-300 bg-gray-50 dark:bg-gray-800"
              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          }`}
        >
          <div className="relative h-40 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 dark:from-gray-700 dark:via-gray-600 dark:to-gray-800">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
            </div>
            {!isProUser && (
              <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 mb-2">
                    <Lock className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Pro Only
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPaymentOverlay(true);
                    }}
                    className="px-3 py-1.5 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 text-xs font-medium rounded transition-colors"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                  customTheme.trim()
                    ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                <Plus className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Custom Theme
              </h3>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              Create your own conversation topic
            </p>

            <input
              type="text"
              placeholder="Enter your topic..."
              value={customTheme}
              onChange={(e) => {
                if (!isProUser) {
                  e.preventDefault();
                  setPaymentOverlay(true);
                  toast.info(
                    "Custom themes are available in Pro plan. Upgrade to unlock!",
                    { position: "top-center" }
                  );
                  return;
                }
                setCustomTheme(e.target.value);
                setSelectedTheme("");
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!isProUser) {
                  setPaymentOverlay(true);
                  toast.info(
                    "Custom themes are available in Pro plan. Upgrade to unlock!",
                    { position: "top-center" }
                  );
                  return;
                }
                setSelectedTheme("");
              }}
              disabled={!isProUser}
              className={`w-full px-3 py-2 rounded-md border text-sm transition-colors ${
                !isProUser
                  ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-not-allowed text-gray-400 dark:text-gray-600"
                  : "border-gray-200 dark:border-gray-700 focus:border-gray-900 dark:focus:border-gray-300 focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              } placeholder-gray-400 dark:placeholder-gray-600`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
