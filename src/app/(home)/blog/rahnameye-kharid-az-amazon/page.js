import Link from "next/link";
import { buildMetadata, breadcrumbJsonLd, blogPostingJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({ title: "راهنمای خرید از آمازون با ویژ مارکت | بلاگ ویژ مارکت", description: "مرحله‌به‌مرحله خرید از آمازون با ویژ مارکت.", path: "/blog/rahnameye-kharid-az-amazon", image: "/assets/blog/amazon-guide.jpg" });

// Content lives here — edit this file directly. To add a new blog, copy this folder and update slug in src/lib/blog/posts.js
export default function PostPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "خانه", path: "/" }, { name: "بلاگ", path: "/blog" }, { name: "راهنمای خرید از آمازون", path: "/blog/rahnameye-kharid-az-amazon" }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd({ title: "راهنمای خرید از آمازون با ویژ مارکت", description: "مرحله‌به‌مرحله خرید از آمازون", slug: "rahnameye-kharid-az-amazon", cover: "/assets/blog/amazon-guide.jpg", date: "2026-03-15" })) }} />
      <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
        → بازگشت به بلاگ
      </Link>
      <h1 className="mt-4 text-2xl font-black leading-8">راهنمای خرید از آمازون با ویژ مارکت</h1>
      <p className="mt-2 text-xs text-muted-foreground">۱۴۰۴/۱۲/۲۵ · ۵ دقیقه مطالعه</p>

      <img src="/assets/blog/amazon-guide.jpg" alt="راهنمای خرید از آمازون" width={800} height={450} className="mt-6 w-full rounded-2xl border border-border/50 object-cover" />

      <article className="mt-8 space-y-6 text-sm leading-8">
        <section className="rounded-2xl border border-border/50 bg-card p-6">
          <h2 className="font-bold text-base">مقدمه</h2>
          <p className="mt-2 text-muted-foreground">ویژ مارکت سفارش‌های آمازون شما را به‌صورت واسطه‌ای ثبت، خریداری و تا ایران پیگیری می‌کند. کافی است لینک محصول را در صفحه «ثبت سفارش آمازون» وارد کنید.</p>
        </section>

        <section className="rounded-2xl border border-border/50 bg-card p-6">
          <h2 className="font-bold text-base">مراحل ثبت سفارش</h2>
          <ol className="mt-2 list-decimal space-y-1 pr-5 text-muted-foreground">
            <li>لینک محصول آمازون را کپی کنید (دامنه باید معتبر باشد).</li>
            <li>در صفحه سفارش، لینک و توضیحات تکمیلی را وارد کنید.</li>
            <li>پس از بررسی، پیش‌فاکتور برای شما صادر می‌شود.</li>
            <li>با پرداخت، خرید انجام و کد پیگیری در اختیار شما قرار می‌گیرد.</li>
          </ol>
        </section>

        <section className="rounded-2xl border border-border/50 bg-card p-6">
          <h2 className="font-bold text-base">هزینه‌ها</h2>
          <p className="mt-2 text-muted-foreground">هزینه نهایی شامل قیمت محصول، حمل بین‌المللی، گمرک و کارمزد ویژ مارکت است و در پیش‌فاکتور به‌صورت شفاف اعلام می‌شود.</p>
        </section>

        <section className="rounded-2xl border border-border/50 bg-card p-6">
          <h2 className="font-bold text-base">نکات مهم</h2>
          <ul className="mt-2 list-disc space-y-1 pr-5 text-muted-foreground">
            <li>از ثبت لینک‌های نامعتبر یا کوتاه‌شده خودداری کنید.</li>
            <li>مشخصات محصول (سایز، رنگ، تعداد) را دقیق وارد کنید.</li>
            <li>زمان تحویل بسته به نوع ارسال ۲ تا ۴ هفته متغیر است.</li>
          </ul>
        </section>
      </article>
    </div>
  );
}
