import React from "react";
import { IoIosColorPalette } from "react-icons/io";
import { Lock, Crown, Plus, Edit3 } from "lucide-react";
import themes from "../../../data/themes.json";
import { toast } from "sonner";

type ThemeSelectionProps = {
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  customTheme: string;
  setCustomTheme: (theme: string) => void;
  isProUser: boolean;
  setPaymentOverlay: (show: boolean) => void;
  iconMap: Record<string, React.ElementType>;
};

export const ThemeSelection = ({
  selectedTheme,
  setSelectedTheme,
  customTheme,
  setCustomTheme,
  isProUser,
  setPaymentOverlay,
  iconMap,
}: ThemeSelectionProps) => {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-gray-700 mb-2 mt-10">
          Conversation Theme
        </h2>
        <div className="bg-gray-100 rounded-full p-2">
          <IoIosColorPalette className="w-6 h-6 text-gray-700" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              className={`relative group rounded-2xl overflow-hidden bg-white shadow-lg transition-all duration-300 h-full flex flex-col ${
                isLocked
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:shadow-2xl transform hover:-translate-y-2"
              } ${
                isSelected
                  ? "ring-4 ring-green-500 ring-opacity-50 shadow-green-200"
                  : isLocked
                  ? ""
                  : "hover:shadow-xl"
              }`}
            >
              {/* Background Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={theme.imgURL}
                  alt={theme.label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Selected
                  </div>
                )}

                {/* Pro Locked Badge */}
                {isLocked && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 flex items-center justify-center">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-xl border-2 border-yellow-300">
                      <div className="flex flex-col items-center gap-2">
                        <Lock className="w-6 h-6 text-yellow-600" />
                        <span className="text-sm font-bold text-gray-900">
                          Pro Only
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPaymentOverlay(true);
                          }}
                          className="mt-1 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Crown className="w-3 h-3" />
                          Upgrade
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? "bg-green-500 text-white"
                        : "bg-green-100 text-green-600 group-hover:bg-green-200"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {theme.label}
                  </h3>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {theme.description}
                </p>
              </div>

              {/* Hover Effect Border */}
              <div
                className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
                  isSelected
                    ? "border-2 border-green-500"
                    : "border-2 border-transparent group-hover:border-green-300"
                }`}
              />
            </div>
          );
        })}
        {/* Custom Theme */}
        <div
          className={`relative group rounded-2xl overflow-hidden bg-white shadow-lg transition-all duration-300 ${
            !isProUser
              ? "opacity-60 cursor-not-allowed"
              : "cursor-pointer hover:shadow-2xl transform hover:-translate-y-2"
          } ${
            customTheme.trim()
              ? "ring-4 ring-green-500 ring-opacity-50 shadow-green-200"
              : !isProUser
              ? ""
              : "hover:shadow-xl"
          }`}
        >
          <div className="relative h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 overflow-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Custom Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Edit3 className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Selected Badge */}
            {customTheme.trim() && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Selected
              </div>
            )}

            {/* Pro Locked Badge */}
            {!isProUser && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 flex items-center justify-center">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-xl border-2 border-yellow-300">
                  <div className="flex flex-col items-center gap-2">
                    <Lock className="w-6 h-6 text-yellow-600" />
                    <span className="text-sm font-bold text-gray-900">
                      Pro Only
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPaymentOverlay(true);
                      }}
                      className="mt-1 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Crown className="w-3 h-3" />
                      Upgrade
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  customTheme.trim()
                    ? "bg-green-500 text-white"
                    : "bg-purple-100 text-purple-600 group-hover:bg-purple-200"
                }`}
              >
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Custom Theme
              </h3>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Create your own conversation topic
            </p>

            <input
              id="custom-theme"
              type="text"
              placeholder="Enter your topic (e.g., cooking, anime, sports...)"
              value={customTheme}
              onChange={(e) => {
                if (!isProUser) {
                  e.preventDefault();
                  setPaymentOverlay(true);
                  toast.info(
                    "Custom themes are available in Pro plan. Upgrade to unlock!",
                    {
                      position: "top-center",
                    }
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
                    {
                      position: "top-center",
                    }
                  );
                  return;
                }
                setSelectedTheme("");
              }}
              disabled={!isProUser}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-colors duration-300 text-gray-900 placeholder-gray-400 ${
                !isProUser
                  ? "border-gray-200 bg-gray-100 cursor-not-allowed"
                  : "border-gray-200 focus:border-green-500 focus:outline-none bg-white"
              }`}
            />
          </div>
          {/* Hover Effect Border */}
          <div
            className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
              customTheme.trim()
                ? "border-2 border-green-500"
                : "border-2 border-transparent group-hover:border-purple-300"
            }`}
          />
        </div>
      </div>
    </div>
  );
};
