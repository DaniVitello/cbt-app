import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border p-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-full" />
      <Skeleton className="mt-1 h-3 w-5/6" />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
