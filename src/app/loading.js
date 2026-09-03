import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      dir="rtl"
      className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-8"
    >
      {/* Hero / heading block */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-3 flex-wrap">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>

      {/* Product card grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="rounded-4xl border border-border/50 p-3 flex flex-col gap-3"
          >
            <Skeleton className="aspect-square w-full rounded-3xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-9 w-9 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
