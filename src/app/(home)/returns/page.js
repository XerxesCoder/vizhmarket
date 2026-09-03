import { buildMetadata } from "@/lib/seo";
export const metadata = buildMetadata({ title: "رویه بازگرداندن کالا | ویژ مارکت", description: "شرایط بازگشت و مرجوعی کالا در ویژ مارکت.", path: "/returns" });
export default function ReturnsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: "رویه بازگرداندن کالا", url: "https://vizhmarket.ir/returns" }) }} />
      <h1 className="text-2xl font-black">رویه بازگرداندن کالا</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
        <p>در صورت مغایرت یا ایراد فنی تا ۷ روز پس از تحویل با پشتیبانی تماس بگیرید.</p>
        <p>کالا باید در بسته‌بندی اولیه و بدون استفاده باشد. هزینه بازگشت در موارد تاییدشده بر عهده فروشگاه است.</p>
        <p>برای ثبت درخواست مرجوعی از بخش پشتیبانی اقدام کنید.</p>
      </div>
    </div>
  );
}
