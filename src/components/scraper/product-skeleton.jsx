// components/scraper/product-skeleton.jsx
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
  return (
    <div className="space-y-6 mt-12">
      <Skeleton className="h-12 w-1/3" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <Skeleton className="lg:col-span-3" />

        <div className="lg:col-span-6 space-y-4">
          <Skeleton className="h-120 w-3/4" />
          <Skeleton className="h-32 w-full" />
        </div>

        {/* CTA / Buy Box Skeleton */}
        <Skeleton className="lg:col-span-3" />
      </div>
    </div>
  );
}
