type SelectModeButtonType = {
  children: any;
  className: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
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

export const RoundedButton = ({
  disabled,
  children,
  className,
  onClick,
  loading,
}: SelectModeButtonType) => {
  return (
    <button
      disabled={disabled || loading}
      className={`cursor-pointer rounded-full flex items-center transition-all duration-300 justify-center relative ${className} ${
        disabled || loading ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={onClick}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div
        className={`flex items-center justify-center ${
          loading ? "invisible" : "visible"
        }`}
      >
        {children}
      </div>
    </button>
  );
};
