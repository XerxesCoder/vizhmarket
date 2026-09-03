import { buildMetadata } from "@/lib/seo";
export const metadata = buildMetadata({ title: "تماس با ما | ویژ مارکت", description: "راه‌های تماس با پشتیبانی ویژ مارکت.", path: "/contact" });
export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "ContactPage", name: "تماس با ما", url: "https://vizhmarket.ir/contact" }) }} />
      <h1 className="text-2xl font-black">تماس با ما</h1>
      <div className="mt-6 rounded-2xl border border-border/50 bg-card p-6 space-y-3 text-sm">
        <p>پشتیبانی: support@vizhmarket.ir</p>
        <p>تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</p>
        <p>آدرس: تهران، خیابان نمونه، پلاک ۱۲۳</p>
      </div>
    </div>
  );
}
