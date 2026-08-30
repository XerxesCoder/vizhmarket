import Link from "next/link";
import {
  IconChevronLeft,
  IconShoppingCart,
  IconTruck,
  IconShieldCheck,
  IconHeadset,
  IconTrendingUp,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { SectionProductCard } from "@/components/store/section-product-card";

const SERVICE_STRIPS = [
  { icon: IconTruck, title: "ارسال اکسپرس", desc: "به سراسر کشور" },
  { icon: IconShieldCheck, title: "ضمانت اصالت", desc: "بازگشت ۷ روزه" },
  { icon: IconHeadset, title: "پشتیبانی ۲۴/۷", desc: "همراه شما هستیم" },
  { icon: IconShoppingCart, title: "قیمت شفاف", desc: "پرداخت امن" },
];

/* ── Category icon strip (like digikala) ── */
function CategoryStrip({ categories = [] }) {
  return (
    <div className="bg-background rounded-2xl border border-border/50 py-4 px-2">
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Link
          href="/store"
          className="shrink-0 flex flex-col items-center gap-2 w-20"
        >
          <span className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-2xl">
            🛍️
          </span>
          <span className="text-[11px] text-center leading-4">همه</span>
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/store/${cat.slug}`}
            className="shrink-0 flex flex-col items-center gap-2 w-20"
          >
            <span className="w-14 h-14 rounded-full overflow-hidden bg-muted">
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  width={56}
                  height={56}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-xl">🛒</span>
              )}
            </span>
            <span className="text-[11px] text-center leading-4 line-clamp-2">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── Hero banner ── */
function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-primary via-primary/95 to-primary/80 text-white">
      <div className="absolute -left-10 -top-10 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
      <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-start">
          <Badge className="bg-white/15 text-white hover:bg-white/20 border-0">
            🔥 فروش ویژه امروز
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black leading-tight">
            خرید آسان، ارسال سریع
          </h1>
          <p className="text-white/85 max-w-md mx-auto md:mx-0">
            کفش، پوشاک و لوازم خانگی با تضمین اصالت — هر آنچه نیاز دارید همینجاست.
          </p>
        </div>
        <div className="shrink-0">
          <Link href="/store">
            <span className="inline-flex items-center gap-2 h-12 px-6 rounded-2xl bg-white text-primary font-bold shadow-lg">
              <IconShoppingCart size={20} />
              ورود به فروشگاه
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Product row section (per category OR best sellers) ── */
function ProductRow({ title, subtitle, linkHref, linkLabel = "مشاهده همه", products }) {
  if (!products.length) return null;
  return (
    <section className="bg-background rounded-2xl border border-border/50 py-5">
      <div className="flex items-center justify-between px-5 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base md:text-lg font-black">{title}</h2>
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </div>
        {linkHref && (
          <Link
            href={linkHref}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:opacity-80"
          >
            {linkLabel}
            <IconChevronLeft size={14} />
          </Link>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto px-5 pb-2 snap-x">
        {products.map((product) => (
          <div key={product.id} className="shrink-0 w-40 sm:w-44 snap-start">
            <SectionProductCard product={product} horizontal />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function LandingPage({ sections = [], bestSellers = [], categories = [] }) {
  return (
    <div dir="rtl" className="w-full">
      <div className="container mx-auto px-4 lg:px-8 py-4 space-y-5">
        {/* Service strip above everything, digikala-style */}
        <div className="flex justify-around bg-background rounded-2xl border border-border/50 py-3 px-2">
          {SERVICE_STRIPS.map((s, i) => (
            <div key={s.title} className="flex items-center gap-2 text-center px-2 justify-center">
              <s.icon size={18} className="text-primary shrink-0" />
              <div className="hidden sm:block text-start">
                <p className="text-[11px] font-bold leading-4">{s.title}</p>
                <p className="text-[10px] text-muted-foreground leading-4">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Hero banner */}
        <HeroBanner />

        {/* Category icon strip */}
        <CategoryStrip categories={categories} />

        {/* Best sellers */}
        <ProductRow
          title="پرفروش‌ترین‌ها"
          subtitle="محبوب‌ترین محصولات کاربران"
          linkHref="/store"
          linkLabel="مشاهده همه"
          products={bestSellers}
        />

        {/* Big featured category banner (hero of the categories area) */}
        {categories.length > 0 && (
          <section className="bg-muted/40 rounded-2xl border border-border/50 p-6 text-center">
            <h2 className="text-lg font-black mb-1">دسته‌بندی‌های ویژه</h2>
            <p className="text-xs text-muted-foreground mb-4">
              از میان دسته‌بندی‌های محبوب ما انتخاب کنید
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/store/${cat.slug}`}
                  className="flex flex-col items-center gap-2 w-24"
                >
                  <span className="w-20 h-20 rounded-2xl overflow-hidden bg-muted">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} width={80} height={80} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-3xl">🛒</span>
                    )}
                  </span>
                  <span className="text-[11px] font-medium text-center line-clamp-2">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Per-category product rows */}
        {sections.map((sec) => (
          <ProductRow
            key={sec.category.id}
            title={sec.category.name}
            linkHref={`/store/${sec.category.slug}`}
            products={sec.products}
          />
        ))}

        {/* Bottom CTA on brand color */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-primary via-primary/95 to-primary/80">
          <div className="absolute top-8 right-8 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
          <div className="relative p-8 md:p-12 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 font-black text-2xl text-white">
              <IconTrendingUp size={26} />
              آماده‌اید خرید را شروع کنید؟
            </div>
            <p className="text-white/85 max-w-md mx-auto text-sm">
              صدها محصول با کیفیت، منتظر شما هستند — همین حالا وارد فروشگاه شوید.
            </p>
            <Link href="/store">
              <span className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl bg-white text-primary font-bold shadow-xl">
                <IconShoppingCart size={20} />
                شروع خرید
              </span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}