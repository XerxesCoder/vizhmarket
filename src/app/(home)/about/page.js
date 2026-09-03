import { buildMetadata } from "@/lib/seo";
export const metadata = buildMetadata({ title: "درباره ما | ویژ مارکت", description: "درباره ویژ مارکت — فروشگاه آنلاین با ارسال اکسپرس.", path: "/about" });
export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "AboutPage", name: "درباره ویژ مارکت", url: "https://vizhmarket.ir/about" }) }} />
      <h1 className="text-2xl font-black">درباره ویژ مارکت</h1>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">ویژ مارکت فروشگاه آنلاین با تمرکز بر کیفیت، قیمت منصفانه و ارسال سریع است. علاوه بر محصولات داخلی، سفارش از آمازون را با پیگیری کامل تا درب منزل انجام می‌دهیم.</p>
    </div>
  );
}
