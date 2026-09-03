import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { getCategoryPage, getCategorySlugs, getNavCategories } from "@/lib/data/web-store";
import CategoryBrowser from "@/components/store/category-browser";
import { Skeleton } from "@/components/ui/skeleton";
import { buildMetadata, breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo";

// Prerender category pages at build; unknown slugs render on demand
export async function generateStaticParams() {
  const categories = await getCategorySlugs();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const cat = await getCategoryPage(category);
  if (!cat) return buildMetadata({ title: "دسته‌بندی یافت نشد", description: "", path: `/store/${category}` });
  return buildMetadata({ title: `${cat.name} | فروشگاه ویژ مارکت`, description: `محصولات دسته ${cat.name} در ویژ مارکت`, path: `/store/${cat.slug}` });
}

// Data access inside Suspense so the static shell prerenders (cache components)
async function CategoryContent({ params }) {
  const { category: slug } = await params;
  const [category, categories] = await Promise.all([getCategoryPage(slug), getNavCategories()]);
  if (!category) notFound();
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 overflow-x-hidden">
      <nav className="flex items-center flex-wrap gap-1.5 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">خانه</Link>
        <IconChevronLeft size={14} />
        <Link href="/store" className="hover:text-foreground">فروشگاه</Link>
        {category.parent && <><IconChevronLeft size={14} /><Link href={`/store/${category.parent.slug}`} className="hover:text-foreground">{category.parent.name}</Link></>}
        <IconChevronLeft size={14} /><span className="text-foreground font-medium">{category.name}</span>
      </nav>
      <h1 className="text-2xl font-black mb-6">{category.name}</h1>
      <CategoryBrowser products={category.products} categories={categories} currentSlug={category.slug} currentName={category.name} currentCategory={category} />
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

