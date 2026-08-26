import {
  IconBrandInstagram,
  IconBrandTelegram,
  IconBrandTwitter,
  IconBrandWhatsapp,
  IconChevronLeft,
} from "@tabler/icons-react";
import Link from "next/link";

const SOCIAL_LINKS = [
  { icon: IconBrandInstagram, href: "#", label: "اینستاگرام" },
  { icon: IconBrandTelegram, href: "#", label: "تلگرام" },
  { icon: IconBrandWhatsapp, href: "#", label: "واتساپ" },
  { icon: IconBrandTwitter, href: "#", label: "توییتر" },
];

const FOOTER_SECTIONS = [
  {
    title: "درباره ویژ مارکت",
    links: [
      "اتاق خبر ویژ مارکت",
      "فروش در ویژ مارکت",
      "تماس با ما",
      "قوانین و مقررات",
    ],
  },
  {
    title: "خدمات مشتریان",
    links: [
      "پرسش‌های متداول",
      "رویه بازگرداندن کالا",
      "شرایط استفاده",
      "گزارش باگ",
    ],
  },
  {
    title: "راهنمای خرید",
    links: ["نحوه ثبت سفارش", "رویه ارسال سفارش", "شیوه‌های پرداخت"],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/50 bg-gradient-to-b from-background to-muted/20" dir="rtl">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-l from-primary/40 via-primary/20 to-transparent" />

      <div className="container mx-auto px-4 lg:px-8">
        {/* Brand Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-10 border-b border-border/50">
          <div className="flex items-center gap-4">
            <span className="text-3xl font-black text-primary tracking-tighter">
              ویژ مارکت
            </span>
            <div className="h-10 w-px bg-border/50 hidden md:block" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                تجربه‌ای متفاوت از خرید آنلاین
              </span>
              <span className="text-base font-bold text-foreground">
                تضمین بهترین قیمت و کیفیت
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-background rounded-xl border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-sm transition-all"
                aria-label={label}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-sm mb-4 text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-default">
                      <IconChevronLeft size={12} className="opacity-50" />
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Trust & Social */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-foreground">
              همراه ما باشید
            </h3>

            <div className="flex gap-2 mb-6">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-background rounded-xl border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-sm transition-all"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="flex gap-3">
              <div className="size-20 bg-background rounded-2xl border border-border/50 flex flex-col items-center justify-center gap-1 text-[9px] text-muted-foreground font-bold hover:border-primary/20 transition-colors">
                <span className="text-primary text-lg font-black">e</span>
                نماد الکترونیک
              </div>
              <div className="size-20 bg-background rounded-2xl border border-border/50 flex flex-col items-center justify-center gap-1 text-[9px] text-muted-foreground font-bold hover:border-primary/20 transition-colors">
                <span className="text-primary text-lg font-black">S</span>
                ساماندهی
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-8 border-t border-border/50">
          <p className="text-xs text-muted-foreground/70 text-center leading-relaxed">
            استفاده از مطالب فروشگاه اینترنتی ویژ مارکت فقط برای مقاصد غیرتجاری و
            با ذکر منبع بلامانع است. کلیه حقوق این سایت متعلق به فروشگاه آنلاین
            ویژ مارکت می‌باشد. © ۱۴۰۳
          </p>
        </div>
      </div>
    </footer>
  );
}
