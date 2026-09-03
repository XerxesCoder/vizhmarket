"use client";
import { getCurrentPersianYear } from "@/lib/utils";
import {
  IconBrandInstagram,
  IconBrandTelegram,
  IconBrandTwitter,
  IconBrandWhatsapp,
  IconChevronLeft,
  IconHelp,
  IconRefresh,
  IconFileText,
  IconShield,
  IconPhone,
  IconInfoCircle,
  IconArticle,
  IconHeadset,
  IconMail,
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
    title: "خدمات مشتریان",
    links: [
      { label: "پرسش‌های متداول", href: "/faq", icon: IconHelp },
      { label: "رویه بازگرداندن کالا", href: "/returns", icon: IconRefresh },
      { label: "شرایط استفاده", href: "/terms", icon: IconFileText },
      { label: "حریم خصوصی", href: "/privacy", icon: IconShield },
    ],
  },
  {
    title: "درباره ویژ مارکت",
    links: [
      { label: "تماس با ما", href: "/contact", icon: IconPhone },
      { label: "درباره ما", href: "/about", icon: IconInfoCircle },
      { label: "بلاگ", href: "/blog", icon: IconArticle },
    ],
  },
  /*   {
    title: "پشتیبانی",
    links: [
      { label: "پشتیبانی آنلاین", href: "/contact", icon: IconHeadset },
      { label: "ایمیل پشتیبانی", href: "mailto:support@vizhmarket.ir", icon: IconMail },
      { label: "تماس با ما", href: "/contact", icon: IconPhone },
    ], 
  },*/
];

export default function Footer() {
  return (
    <footer
      className="mt-auto border-t border-border/50 bg-linear-to-b from-background to-muted/20"
      dir="rtl"
    >
      {/* Top accent bar */}
      <div className="h-1 bg-linear-to-l from-primary/40 via-primary/20 to-transparent" />

      <div className="container mx-auto px-4">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* 1. Brand Section (Right Side in RTL) */}
          <div className="flex flex-col gap-4">
            <span className="text-3xl font-black text-primary tracking-tighter">
              ویژ مارکت
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">
                تجربه‌ای متفاوت از خرید آنلاین
              </span>
              <span className="text-sm font-semibold text-foreground">
                تضمین بهترین قیمت و کیفیت
              </span>
            </div>

            {/* Social Links next to brand */}
            <div className="flex gap-2 mt-2">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-background rounded-lg border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-sm transition-all"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Services Links */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-sm mb-4 text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => {
                  const LinkIcon = link.icon || IconChevronLeft;
                  return (
                    <li key={link.label + link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <LinkIcon size={14} className="opacity-70" />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* 3. Trust Badges (Left Side in RTL) */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-foreground">
              نمادهای اعتماد
            </h3>
            <div className="flex gap-3">
              <div className="size-20 bg-background rounded-2xl border border-border/50 flex flex-col items-center justify-center gap-1 text-[10px] text-muted-foreground font-bold hover:border-primary/20 transition-colors">
                <span className="text-primary text-lg font-black">e</span>
                <span className="text-center leading-tight">
                  نماد
                  <br />
                  الکترونیک
                </span>
              </div>
              <div className="size-20 bg-background rounded-2xl border border-border/50 flex flex-col items-center justify-center gap-1 text-[10px] text-muted-foreground font-bold hover:border-primary/20 transition-colors">
                <span className="text-primary text-lg font-black">S</span>
                <span className="text-center leading-tight">ساماندهی</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground/70 text-center leading-relaxed">
            کلیه حقوق این سایت متعلق به فروشگاه آنلاین ویژ مارکت می‌باشد. ©{" "}
            {getCurrentPersianYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
