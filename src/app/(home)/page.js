import LandingPage from "@/components/Landing/Landing";
import { getLandingData, getNavCategories } from "@/lib/data/web-store";
import { buildMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata = buildMetadata({
  title: `${SITE_NAME} | فروشگاه اینترنتی با ارسال یک روزه`,
  description: "خرید آنلاین محصولات دیجیتال، مد و پوشاک با تخفیف‌های انفجاری و ارسال اکسپرس در ویژ مارکت",
  path: "/",
});

export default async function Home() {
  const [{ sections, bestSellers }, categories] = await Promise.all([getLandingData(), getNavCategories()]);
  const itemListLd = bestSellers?.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: bestSellers.slice(0, 10).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/store/${p.category?.slug}/${p.slug}`,
          name: p.title,
        })),
      }
    : null;
  return (
    <div className="w-full">
      {itemListLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />}
      <LandingPage sections={sections} bestSellers={bestSellers} categories={categories} />
    </div>
  );
}
