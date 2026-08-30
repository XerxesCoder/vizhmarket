import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionProductCard } from "@/components/store/section-product-card";
import { IconChevronLeft, IconPackageOff } from "@tabler/icons-react";
import { getCategoryPage, getCategorySlugs } from "@/lib/data/web-store";
import { Skeleton } from "@/components/ui/skeleton";

// Prerender category pages at build; unknown slugs render on demand
export async function generateStaticParams() {
  const categories = await getCategorySlugs();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const cat = await getCategoryPage(category);
  return { title: cat ? `${cat.name} | فروشگاه ویژ مارکت` : "دسته‌بندی یافت نشد" };
}

// Data access inside Suspense so the static shell prerenders (cache components)
async function CategoryContent({ params }) {
  const { category: slug } = await params;
  const category = await getCategoryPage(slug);
  if (!category) notFound();

  const products = category.products;

  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center flex-wrap gap-1.5 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">خانه</Link>
        <IconChevronLeft size={14} />
        <Link href="/store" className="hover:text-foreground">فروشگاه</Link>
        {category.parent && (
          <>
            <IconChevronLeft size={14} />
            <Link href={`/store/${category.parent.slug}`} className="hover:text-foreground">
              {category.parent.name}
            </Link>
          </>
        )}
        <IconChevronLeft size={14} />
        <span className="text-foreground font-medium">{category.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl font-black">{category.name}</h1>
        {category.children.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {category.children.map((child) => (
              <Link
                key={child.id}
                href={`/store/${child.slug}`}
                className="px-4 py-2 rounded-xl border border-border text-sm text-foreground/70 hover:border-primary/40 hover:text-primary transition-colors"
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-muted-foreground">
          <IconPackageOff size={48} />
          <p>محصولی در این دسته‌بندی وجود ندارد</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <SectionProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <Skeleton className="h-4 w-40 mb-8" />
      <Skeleton className="h-9 w-48 mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function CategoryPage({ params }) {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

