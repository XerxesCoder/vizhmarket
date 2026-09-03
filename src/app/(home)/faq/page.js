import { buildMetadata } from "@/lib/seo";
export const metadata = buildMetadata({ title: "پرسش‌های متداول | ویژ مارکت", description: "پاسخ به سوالات پرتکرار خرید، پرداخت و ارسال در ویژ مارکت.", path: "/faq" });
const faqs = [
  { q: "چطور سفارش ثبت کنم؟", a: "محصول را به سبد اضافه کنید و از طریق تسویه حساب، آدرس و پرداخت را تکمیل کنید. برای آمازون از صفحه سفارش محصول لینک را وارد کنید." },
  { q: "زمان ارسال چقدر است؟", a: "سفارش‌های اکسپرس ۱ تا ۳ روز کاری و سایر سفارش‌ها ۱۵ تا ۳۰ روز کاری." },
  { q: "پرداخت امن است؟", a: "بله، پرداخت از طریق درگاه زرین‌پال انجام می‌شود و اطلاعات کارت نزد ما ذخیره نمی‌شود." },
  { q: "چطور سفارشم را پیگیری کنم؟", a: "از بخش پروفایل > سفارش‌ها وضعیت را ببینید یا با پشتیبانی تماس بگیرید." },
];
export default function FaqPage() {
  const jsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-2xl font-black">پرسش‌های متداول</h1>
      <div className="mt-8 space-y-4">{faqs.map((f) => <div key={f.q} className="rounded-2xl border border-border/50 bg-card p-5"><h2 className="font-bold text-sm">{f.q}</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">{f.a}</p></div>)}</div>
    </div>
  );
}
