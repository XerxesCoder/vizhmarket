import Link from "next/link";
import {
  IconShoppingCart,
  IconTruck,
  IconShieldCheck,
  IconLink,
  IconArrowLeft,
  IconCheck,
  IconWorld,
  IconStar,
  IconHeart,
  IconDiscount,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  {
    step: "۱",
    title: "محصول را در آمازون پیدا کنید",
    desc: "به سایت آمازون امارات (amazon.ae) بروید و محصول مورد نظر خود را پیدا کنید.",
    icon: IconWorld,
  },
  {
    step: "۲",
    title: "لینک محصول را کپی کنید",
    desc: "لینک صفحه محصول را کپی کرده و در کادر جستجوی ویژ مارکت قرار دهید.",
    icon: IconLink,
  },
  {
    step: "۳",
    title: "سفارش دهید و تحویل بگیرید",
    desc: "قیمت نهایی به تومان را مشاهده کنید، پرداخت نمایید و منتظر تحویل اکسپرس باشید.",
    icon: IconTruck,
  },
];

const FEATURES = [
  {
    icon: IconShieldCheck,
    title: "تضمین اصالت کالا",
    desc: "تمامی محصولات مستقیماً از آمازون تهیه شده و ۱۰۰٪ اورجینال هستند.",
  },
  {
    icon: IconTruck,
    title: "ارسال اکسپرس به ایران",
    desc: "تحویل سفارشات در سریع‌ترین زمان ممکن (۱۵ تا ۲۰ روز کاری).",
  },
  {
    icon: IconShoppingCart,
    title: "قیمت شفاف و نهایی",
    desc: "قیمت نمایش داده شده شامل هزینه کالا، حمل‌ونقل و گمرک است.",
  },
  {
    icon: IconCheck,
    title: "۷ روز ضمانت بازگشت",
    desc: "در صورت وجود هرگونه مغایرت، امکان بازگشت کالا وجود دارد.",
  },
];

export default function LandingPage() {
  return (
    <div className="w-full" dir="rtl">
      {/* ════════════ 1. Hero Section ════════════ */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-background pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/[0.03] rounded-full blur-3xl" />

        <div className="container mx-auto px-4 text-center space-y-8 relative z-10">
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-1.5 text-sm font-medium animate-fade-in"
          >
            🚀 سریع‌ترین راه خرید از آمازون امارات
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight animate-fade-in [animation-delay:100ms]">
            خرید مستقیم از آمازون،
            <span className="bg-gradient-to-l from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent block mt-2">
              بدون واسطه و با تضمین قیمت
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in [animation-delay:200ms]">
            لینک محصول مورد نظر خود را از آمازون امارات کپی کنید. ما آن را با
            بهترین نرخ ارز، تضمین اصالت کالا و ارسال اکسپرس به دست شما
            می‌رسانیم.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in [animation-delay:300ms]">
            <Link href="/order">
              <Button
                size="lg"
                className="h-14 px-8 text-lg font-bold gap-3 shadow-xl hover:shadow-2xl transition-all bg-primary hover:bg-primary/90 rounded-2xl"
              >
                <IconShoppingCart size={22} />
                شروع سفارش‌گذاری
              </Button>
            </Link>

            <Link
              href="https://www.amazon.ae"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg font-medium gap-3 border-primary/30 hover:bg-primary/5 hover:border-primary/50 rounded-2xl"
              >
                <IconWorld size={22} />
                مشاهده آمازون امارات
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground animate-fade-in [animation-delay:400ms]">
            {[
              "بدون هزینه گمرکی پنهان",
              "تحویل ۱۵ تا ۲۰ روزه",
              "۱۰۰٪ اورجینال",
            ].map((text) => (
              <span key={text} className="flex items-center gap-1.5">
                <IconCheck size={16} className="text-green-500" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ 2. How It Works ════════════ */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14 space-y-3">
            <Badge variant="outline" className="px-3 py-1 text-xs border-primary/20">
              🤔 نحوه کار
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black">
              چطور از ویژ مارکت خرید کنیم؟
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              فرآیند خرید از آمازون را برای شما به ساده‌ترین شکل ممکن
              درآورده‌ایم.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {STEPS.map((item, index) => (
              <Card
                key={index}
                className="relative border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
              >
                <CardContent className="pt-10 pb-8 px-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300 group-hover:scale-110">
                    <item.icon size={30} className="text-primary" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ 3. Features ════════════ */}
      <section className="py-20 md:py-28 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14 space-y-3">
            <Badge variant="outline" className="px-3 py-1 text-xs border-primary/20">
              ✨ مزایا
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black">چرا ویژ مارکت؟</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              ما با حذف واسطه‌ها، خریدی امن، شفاف و مقرون‌به‌صرفه را برای شما
              فراهم می‌کنیم.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="group bg-background p-7 rounded-2xl border border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center mb-5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all group-hover:scale-110">
                  <feature.icon size={26} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ 4. Bottom CTA ════════════ */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 text-center space-y-6 relative z-10">
          <Badge className="bg-white/15 text-white hover:bg-white/20 border-0 px-4 py-1.5">
            🎯 آماده خرید هستید؟
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black text-white">
            آماده‌اید اولین خرید خود را انجام دهید؟
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            همین حالا لینک محصول مورد نظر خود را وارد کنید و قیمت نهایی آن را به
            تومان مشاهده نمایید.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/order">
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-8 text-lg font-bold gap-3 bg-white text-primary hover:bg-white/90 shadow-2xl rounded-2xl"
              >
                <IconLink size={22} />
                ورود به بخش سفارش‌گذاری
                <IconArrowLeft size={20} className="rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
