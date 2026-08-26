// components/scraper/product-skeleton.jsx
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
  return (
    <div className="space-y-6 mt-12 animate-pulse">
      <Skeleton className="h-12 w-1/3 rounded-lg" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-3 space-y-4">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="size-16 rounded-xl" />
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <Skeleton className="h-6 w-1/4 rounded-md" />
          <Skeleton className="h-8 w-3/4 rounded-md" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
