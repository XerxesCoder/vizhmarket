import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "حریم خصوصی | ویژ مارکت", description: "سیاست حریم خصوصی و نحوه جمع‌آوری و استفاده از داده‌ها در ویژ مارکت.", path: "/privacy" });

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: "حریم خصوصی", url: "https://vizhmarket.ir/privacy", inLanguage: "fa-IR" }) }} />
      <h1 className="text-2xl font-black tracking-tight">حریم خصوصی</h1>
      <p className="mt-2 text-sm text-muted-foreground">آخرین به‌روزرسانی: اسفند ۱۴۰۴</p>
      <div className="mt-8 space-y-6">
        <section className="rounded-2xl border border-border/50 bg-card p-6"><h2 className="font-bold">چه داده‌ای جمع‌آوری می‌کنیم</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">اطلاعات حساب (نام، شماره تماس، ایمیل)، آدرس ارسال، و جزییات سفارش. داده‌های پرداخت نزد درگاه پرداخت می‌ماند و نزد ما ذخیره نمی‌شود.</p></section>
        <section className="rounded-2xl border border-border/50 bg-card p-6"><h2 className="font-bold">چگونه استفاده می‌کنیم</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">برای پردازش و ارسال سفارش، پشتیبانی، و بهبود تجربه کاربری. هیچ‌گاه اطلاعات شما را بدون رضایت به شخص ثالث نمی‌فروشیم.</p></section>
        <section className="rounded-2xl border border-border/50 bg-card p-6"><h2 className="font-bold">کوکی‌ها</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">برای حفظ نشست کاربری و تحلیل ناشناس ترافیک استفاده می‌شود. می‌توانید کوکی‌ها را از تنظیمات مرورگر غیرفعال کنید.</p></section>
        <section className="rounded-2xl border border-border/50 bg-card p-6"><h2 className="font-bold">حقوق شما</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">می‌توانید درخواست مشاهده، اصلاح یا حذف داده‌های خود را از طریق پشتیبانی ثبت کنید.</p></section>
        <section className="rounded-2xl border border-border/50 bg-card p-6"><h2 className="font-bold">تماس</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">برای سوالات حریم خصوصی با پشتیبانی ویژ مارکت تماس بگیرید.</p></section>
      </div>
    </div>
  );
}
