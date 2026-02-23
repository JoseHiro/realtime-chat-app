export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden rounded bg-gray-300 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
  </div>
);

// Usage: <Skeleton className="w-64 h-4" />, <Skeleton className="w-32 h-4 mt-2" />
