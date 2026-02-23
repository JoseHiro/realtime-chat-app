import { cn } from "@lib/utils";
export const Container = ({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {title && <h3 className="text-black">{title}</h3>}
      <div
        className={cn(
          "border border-gray-200 bg-black p-2 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.1)] p-4",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};
