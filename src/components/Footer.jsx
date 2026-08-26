import {
  IconBrandInstagram,
  IconBrandTelegram,
  IconBrandTwitter,
} from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t mt-auto" dir="rtl">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Top Section: Logo & Slogan (No Phone Number) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-8 border-b border-border">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-black text-primary tracking-tighter">
              ویژمارکت
            </span>
            <div className="h-8 w-px bg-border hidden md:block"></div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                تجربه‌ای متفاوت از خرید آنلاین
              </span>
              <span className="text-lg font-bold text-foreground">
                تضمین بهترین قیمت و کیفیت
              </span>
            </div>
          </div>
        </div>

        {/* Text Grid (No Links) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
          <div>
            <h3 className="font-bold text-base mb-4 text-foreground">
              درباره ویژمارکت
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <span className="cursor-default hover:text-foreground transition-colors">
                  اتاق خبر ویژمارکت
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-foreground transition-colors">
                  فروش در ویژمارکت
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-foreground transition-colors">
                  تماس با ما
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-foreground transition-colors">
                  قوانین و مقررات
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-base mb-4 text-foreground">
              خدمات مشتریان
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <span className="cursor-default hover:text-foreground transition-colors">
                  پاسخ به پرسش‌های متداول
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-foreground transition-colors">
                  رویه‌های بازگرداندن کالا
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-foreground transition-colors">
                  شرایط استفاده
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-foreground transition-colors">
                  گزارش باگ
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-base mb-4 text-foreground">
              راهنمای خرید
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <span className="cursor-default hover:text-foreground transition-colors">
                  نحوه ثبت سفارش
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-foreground transition-colors">
                  رویه ارسال سفارش
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-foreground transition-colors">
                  شیوه‌های پرداخت
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-base mb-4 text-foreground">
              همراه ما باشید!
            </h3>

            {/* Static Social Icons (No Links) */}
            <div className="flex gap-3 mb-6">
              <span className="p-2.5 bg-background rounded-lg border text-muted-foreground hover:text-foreground transition-all cursor-default">
                <IconBrandInstagram size={20} />
              </span>
              <span className="p-2.5 bg-background rounded-lg border text-muted-foreground hover:text-foreground transition-all cursor-default">
                <IconBrandTelegram size={20} />
              </span>
              <span className="p-2.5 bg-background rounded-lg border text-muted-foreground hover:text-foreground transition-all cursor-default">
                <IconBrandTwitter size={20} />
              </span>
            </div>

            {/* Trust Badges Placeholders */}
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-background rounded-lg border flex items-center justify-center text-[10px] text-muted-foreground font-bold">
                اینماد
              </div>
              <div className="w-20 h-20 bg-background rounded-lg border flex items-center justify-center text-[10px] text-muted-foreground font-bold">
                ساماندهی
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center md:text-right">
          <p className="text-xs text-muted-foreground leading-relaxed">
            استفاده از مطالب فروشگاه اینترنتی ویژمارکت فقط برای مقاصد غیرتجاری و
            با ذکر منبع بلامانع است. کلیه حقوق این سایت متعلق به فروشگاه آنلاین
            ویژمارکت می‌باشد. © ۱۴۰۳
          </p>
        </div>
      </div>
    </footer>
  );
}
