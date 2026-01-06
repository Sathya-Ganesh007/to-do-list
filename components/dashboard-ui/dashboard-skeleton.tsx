export function DashboardSkeleton() {
  return (
    <div className="container px-4 py-10 mx-auto">
      <div className="flex-1 w-full flex flex-col gap-8">
        {/* Header Section Skeleton */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-8 w-64 bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded-md" />
            </div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl bg-muted/40 animate-pulse border border-muted/50"
            />
          ))}
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[300px] rounded-xl bg-muted/40 animate-pulse border border-muted/50" />
          <div className="h-[300px] rounded-xl bg-muted/40 animate-pulse border border-muted/50" />
        </div>

        {/* Task List Section Skeleton */}
        <div className="space-y-6 mt-4">
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
            <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
          </div>
          <div className="space-y-3">
            <div className="h-16 w-full rounded-lg bg-muted/30 animate-pulse border border-muted/40" />
            <div className="h-16 w-full rounded-lg bg-muted/30 animate-pulse border border-muted/40" />
            <div className="h-16 w-full rounded-lg bg-muted/30 animate-pulse border border-muted/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
