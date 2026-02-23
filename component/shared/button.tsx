import { cn } from "@lib/utils";

type SelectModeButtonType = {
  children: any;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "green" | "gray" | "blue" | "white" | "black";
};

export const SelectModeButton = ({
  children,
  className,
  onClick,
}: SelectModeButtonType) => {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

const COLOR = {
  green:
    "bg-green-500 hover:bg-green-600 text-white transition-all duration-200 hover:scale-105",
  gray: "bg-gray-500 hover:bg-gray-600 text-white",
  blue: "bg-blue-500 hover:bg-blue-600 text-white",
  white: "bg-white text-green-600 hover:bg-green-50 border border-green-200",
  black: "bg-black text-white hover:bg-gray-800",
};

export const RoundedButton = ({
  disabled,
  children,
  className,
  onClick,
  variant = "black",
  loading,
}: SelectModeButtonType) => {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "cursor-pointer px-6 py-2 shadow-md hover:shadow-lg flex items-center transition-all duration-300 justify-center relative",
        className,
        disabled || loading
          ? "cursor-not-allowed opacity-75"
          : "cursor-pointer",
        COLOR[variant as keyof typeof COLOR],
        "rounded-full", // Always apply rounded-full last to ensure it takes precedence
      )}
      onClick={onClick}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div
        className={`flex items-center justify-center transition-opacity duration-200 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </button>
  );
};

export const SummaryButton = ({
  summary,
  onClick,
}: {
  summary: any;
  onClick: () => void;
}) => {
  return (
    <button
      className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 ${
        !summary
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600 cursor-pointer"
      }`}
      disabled={!summary}
      onClick={() => {
        if (summary) {
          onClick();
        }
      }}
    >
      {summary ? "Summary" : "No Summary"}
    </button>
  );
};

export const IconButton = ({
  icon,
  onClick,
  className,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <button className={className} onClick={onClick}>
      {icon}
    </button>
  );
};
