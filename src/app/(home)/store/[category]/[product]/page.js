import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/store/product-detail";
import { Breadcrumb } from "@/components/store/breadcrumb";
import { getProductPage, getProductSlugs } from "@/lib/data/web-store";
import { Skeleton } from "@/components/ui/skeleton";

// Prerender product pages at build; new products render on demand
export async function generateStaticParams() {
  const products = await getProductSlugs();
  return products.map((p) => ({ category: p.category.slug, product: p.slug }));
}

export async function generateMetadata({ params }) {
  const { product, category } = await params;
  const productData = await getProductPage(category, product);
  return {
    title: productData ? `${productData.title} | ویژ مارکت` : "محصول یافت نشد | ویژ مارکت",
  };
}

// Product detail skeleton shown while the product streams in (PPR static shell)
function ProductSkeleton() {
  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square rounded-3xl" />
        <div className="flex flex-col gap-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

// Data access happens INSIDE the Suspense boundary so the static shell can
// prerender and the product streams in at request time (cache components).
async function ProductContent({ params }) {
  const { category: categorySlug, product: productSlug } = await params;
  const product = await getProductPage(categorySlug, productSlug);
  if (!product) notFound();

  const { category } = product;
  const trail = [
    ...(category.parent
      ? [{ label: category.parent.name, href: `/store/${category.parent.slug}` }]
      : []),
    { label: category.name, href: `/store/${category.slug}` },
  ];

  return (
    <>
      <Breadcrumb trail={trail} current={product.title} />
      <ProductDetail product={product} />
    </>
  );
}

export default function StoreProductPage({ params }) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}


