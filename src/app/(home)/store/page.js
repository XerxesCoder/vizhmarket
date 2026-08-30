import { Suspense } from "react";
import StoreBrowser from "@/components/store/store-browser";
import { getStoreData } from "@/lib/data/web-store";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "فروشگاه | ویژ مارکت" };

// Data access inside Suspense so the static shell prerenders (cache components)
async function StoreContent({ searchParams }) {
  const { products, categories } = await getStoreData();
  const { category } = await searchParams;

  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <StoreBrowser
        products={products}
        categories={categories}
        initialCategory={category ?? null}
      />
    </div>
  );
}

function StoreSkeleton() {
  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <Skeleton className="lg:w-60 h-64 rounded-3xl shrink-0" />
        <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StorePage({ searchParams }) {
  return (
    <Suspense fallback={<StoreSkeleton />}>
      <StoreContent searchParams={searchParams} />
    </Suspense>
  );
}
