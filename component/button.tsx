type SelectModeButtonType = {
  children: any;
  className: string;
  onClick: () => void;
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
  children,
  className,
  onClick,
}: SelectModeButtonType) => {
  return (
    <button
      className={`cursor-pointer rounded-full flex items-center transition-all duration-300 justify-center ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
