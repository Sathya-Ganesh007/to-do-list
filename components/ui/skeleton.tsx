import { cn } from "@/lib/utils";

/**
 * GENERIC SKELETON BASE
 * The building block for all other loading states.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/5", className)}
      {...props}
    />
  );
}

/**
 * REUSABLE UI PATTERNS
 * Professional, high-fidelity loading states for the entire website.
 */

// 1. Generic Card/Box (Used for stats, features, or small containers)
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white/5 border border-white/5 p-6 space-y-4",
        className
      )}
    >
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
    </div>
  );
}

// 2. Generic List Item (Used for tasks, notifications, or simple rows)
export function ListItemSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-20 w-full rounded-3xl bg-white/5 border border-white/5 flex items-center px-6 gap-6",
        className
      )}
    >
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-3 w-1/6" />
      </div>
    </div>
  );
}

// 3. Section Header (Useful for any page title section)
export function HeaderSkeleton() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
      <div className="space-y-4">
        <Skeleton className="h-12 w-64 md:w-80 rounded-xl" />
        <Skeleton className="h-4 w-48 md:w-60" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-14 w-32 rounded-xl" />
        <Skeleton className="h-14 w-32 rounded-xl" />
      </div>
    </div>
  );
}

/**
 * FEATURE-SPECIFIC LAYOUTS
 * These combine the patterns above for specific pages.
 */

// Full Dashboard Loader
export function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 p-6 md:p-12">
      <HeaderSkeleton />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Content List */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-40 mb-6" />
        <ListItemSkeleton />
        <ListItemSkeleton />
        <ListItemSkeleton />
      </div>
    </div>
  );
}

export { Skeleton };
