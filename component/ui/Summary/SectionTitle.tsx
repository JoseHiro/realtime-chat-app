type SectionTitleProps = {
  title: string;
  icon?: React.ElementType;
};
export const SectionTitle = ({ title, icon: Icon }: SectionTitleProps) => {
  return (
    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-gray-600" />}
      {title}
    </h3>
  );
};

export const SectionSubTitle = ({ title, icon: Icon }: SectionTitleProps) => {
  return (
    <div className="text-xs text-gray-500 mb-2">
      {Icon && <Icon className="w-4 h-4 text-gray-600" />}
      {title}
    </div>
  );
};
