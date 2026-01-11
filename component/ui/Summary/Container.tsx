export const SectionContainer = ({
  children,
  containerName,
  icon: Icon,
}: {
  children: React.ReactNode;
  containerName: string;
  icon?: React.ElementType;
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        {Icon && <Icon className="w-5 h-5 mr-2 text-gray-600" />}
        {containerName}
      </h2>
      {children}
    </div>
  );
};

export const SectionDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`rounded-lg p-4 text-sm text-gray-800 leading-relaxed ${className}`}
    >
      {children}
    </div>
  );
};
