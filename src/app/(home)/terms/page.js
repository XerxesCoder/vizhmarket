import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "قوانین و مقررات | ویژ مارکت", description: "قوانین استفاده، ثبت سفارش، پرداخت و ارسال در ویژ مارکت.", path: "/terms" });

const sections = [
  { title: "۱. کلیات", body: "استفاده از وب‌سایت ویژ مارکت به‌منزله پذیرش کامل قوانین و مقررات حاضر است. ویژ مارکت حق تغییر این قوانین را در هر زمان دارد و نسخه به‌روز در همین صفحه منتشر می‌شود." },
  { title: "۲. ثبت سفارش و قیمت‌ها", body: "قیمت‌ها به تومان نمایش داده می‌شود و ممکن است به‌دلیل نوسان ارز یا موجودی تغییر کند. ثبت سفارش به‌معنای قطعی شدن خرید نیست؛ تایید نهایی پس از بررسی موجودی و پیش‌فاکتور انجام می‌شود." },
  { title: "۳. سفارش‌های آمازون (واسطه خرید)", body: "در سرویس واسطه خرید آمازون، ویژ مارکت به‌عنوان کارگزار خرید عمل می‌کند. مسئولیت اصالت کالا بر عهده فروشنده آمازون است. هزینه‌های حمل بین‌المللی، گمرک و کارمزد در پیش‌فاکتور اعلام می‌شود و پس از تایید شما خرید انجام خواهد شد." },
  { title: "۴. پرداخت", body: "پرداخت از طریق درگاه‌های مورد تایید انجام می‌شود. اطلاعات پرداخت شما نزد ویژ مارکت ذخیره نمی‌شود." },
  { title: "۵. ارسال و تحویل", body: "زمان تحویل سفارش‌های داخلی و بین‌المللی به موجودی، مقصد و روش ارسال بستگی دارد. تاخیر ناشی از گمرک یا شرکت‌های حمل، خارج از کنترل ویژ مارکت است اما پیگیری خواهد شد." },
  { title: "۶. بازگشت و مرجوعی", body: "در صورت مغایرت کالا یا ایراد فنی، تا ۷ روز پس از تحویل با پشتیبانی تماس بگیرید. کالای مرجوعی باید در بسته‌بندی اولیه و بدون استفاده باشد." },
  { title: "۷. حساب کاربری", body: "مسئولیت حفظ محرمانگی حساب بر عهده کاربر است. هرگونه سوءاستفاده از حساب را فورا اطلاع دهید." },
];

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: "قوانین و مقررات", url: "https://vizhmarket.ir/terms", inLanguage: "fa-IR" }) }} />
      <h1 className="text-2xl font-black tracking-tight">قوانین و مقررات</h1>
      <p className="mt-2 text-sm text-muted-foreground">آخرین به‌روزرسانی: اسفند ۱۴۰۴</p>
      <div className="mt-8 space-y-6">
        {sections.map((s) => (
          <section key={s.title} className="rounded-2xl border border-border/50 bg-card p-6">
            <h2 className="font-bold">{s.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
