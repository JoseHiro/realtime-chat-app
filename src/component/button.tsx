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
