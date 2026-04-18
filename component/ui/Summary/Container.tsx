export const SectionContainer = ({
  children,
  containerName,
}: {
  children: React.ReactNode;
  containerName: string;
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">
        {containerName}
      </p>
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
