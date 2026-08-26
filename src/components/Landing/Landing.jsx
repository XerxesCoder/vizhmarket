import Link from "next/link";
import {
  IconShoppingCart,
  IconTruck,
  IconShieldCheck,
  IconLink,
  IconArrowLeft,
  IconCheck,
  IconWorld,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="w-full" dir="rtl">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
        <div className="container mx-auto px-4 text-center space-y-8">
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-1.5 text-sm font-medium"
          >
            🚀 سریع‌ترین راه خرید از آمازون امارات
          </Badge>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-tight">
            خرید مستقیم از آمازون،
            <span className="text-primary block mt-2">
              بدون واسطه و با تضمین قیمت
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            لینک محصول مورد نظر خود را از آمازون امارات کپی کنید. ما آن را با
            بهترین نرخ ارز، تضمین اصالت کالا و ارسال اکسپرس به دست شما
            می‌رسانیم.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {/* Primary CTA: Goes to your internal ordering/scraper page */}
            <Link href="/order">
              <Button
                size="lg"
                className="h-14 px-8 text-lg font-bold gap-2 shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90"
              >
                <IconShoppingCart size={22} />
                شروع سفارش‌گذاری
              </Button>
            </Link>

            {/* Secondary CTA: Goes directly to Amazon AE */}
            <Link
              href="https://www.amazon.ae"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg font-medium gap-2 border-primary/30 hover:bg-primary/5"
              >
                <IconWorld size={22} />
                مشاهده آمازون امارات
              </Button>
            </Link>
          </div>

          {/* Trust Indicators under Hero */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <IconCheck size={16} className="text-green-500" /> بدون هزینه
              گمرکی پنهان
            </span>
            <span className="flex items-center gap-1.5">
              <IconCheck size={16} className="text-green-500" /> تحویل ۱۵ تا ۲۰
              روزه
            </span>
            <span className="flex items-center gap-1.5">
              <IconCheck size={16} className="text-green-500" /> ۱۰۰٪ اورجینال
            </span>
          </div>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              چطور از ویژ مارکت خرید کنیم؟
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              فرآیند خرید از آمازون را برای شما به ساده‌ترین شکل ممکن
              درآورده‌ایم.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
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
            ].map((item, index) => (
              <Card
                key={index}
                className="relative border-border/50 hover:border-primary/30 transition-colors group"
              >
                <CardContent className="pt-8 pb-8 px-6 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <item.icon size={28} className="text-primary" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-md">
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

      {/* 3. Features / Trust Badges Section */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">چرا ویژ مارکت؟</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              ما با حذف واسطه‌ها، خریدی امن، شفاف و مقرون‌به‌صرفه را برای شما
              فراهم می‌کنیم.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
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
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-background p-6 rounded-2xl border border-border/50 hover:shadow-lg transition-all duration-300"
              >
                <feature.icon size={32} className="text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-black">
            آماده‌اید اولین خرید خود را انجام دهید؟
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            همین حالا لینک محصول مورد نظر خود را وارد کنید و قیمت نهایی آن را به
            تومان مشاهده نمایید.
          </p>
          <Link href="/order">
            <Button
              size="lg"
              variant="secondary"
              className="h-14 px-8 text-lg font-bold gap-2 bg-background text-primary hover:bg-background/90 shadow-xl"
            >
              <IconLink size={22} />
              ورود به بخش سفارش‌گذاری
              <IconArrowLeft size={20} className="rotate-180" />{" "}
              {/* Points left in RTL */}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
