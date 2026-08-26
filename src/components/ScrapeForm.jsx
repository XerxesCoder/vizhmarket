/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  IconAlertCircle,
  IconLink,
  IconPackage,
  IconTruck,
  IconRefresh,
  IconShieldCheck,
  IconClock,
  IconChevronLeft,
  IconShoppingCart,
  IconSearch,
  IconArrowRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { scrapeAmazonProductQWEN as scrapeProduct } from "@/app/actions/amazonScraper";

// Helper to filter out injected JS garbage from details
const isValidDetail = (value) => {
  if (typeof value !== "string") return false;
  const cleanVal = value.trim();
  return (
    cleanVal.length < 150 &&
    !cleanVal.includes("var ") &&
    !cleanVal.includes("function") &&
    !cleanVal.includes("P.when") &&
    !cleanVal.includes("ue.count")
  );
};

// Mock AED/SAR to Toman converter
const RATE_TO_TOMAN = 54580;
const formatToman = (price) => {
  const toman = Math.round(price * RATE_TO_TOMAN);
  return new Intl.NumberFormat("fa-IR").format(toman);
};

// Validate allowed domains
const ALLOWED_DOMAINS = ["amazon.ae", "shein.com", "noon.com"];
const isValidDomain = (url) => {
  try {
    const parsed = new URL(url);
    return ALLOWED_DOMAINS.some((domain) => parsed.hostname.endsWith(domain));
  } catch {
    return false;
  }
};

// Get friendly store name
const getStoreName = (url) => {
  if (url.includes("amazon.ae")) return "آمازون امارات";
  if (url.includes("shein.com")) return "شئین (Shein)";
  if (url.includes("noon.com")) return "نون (Noon)";
  return "فروشگاه نامشخص";
};

// Get currency symbol based on store
const getCurrency = (url) => {
  if (url.includes("amazon.ae") || url.includes("noon.com")) return "درهم";
  if (url.includes("shein.com")) return "درهم"; // Shein UAE also uses AED
  return "AED";
};

export default function OrderProductView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [url, setUrl] = useState("");

  const queryUrl = searchParams.get("url") || "";

  const [inputValue, setInputValue] = useState(queryUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    setInputValue(queryUrl);
  }, [queryUrl]);

  useEffect(() => {
    if (!queryUrl) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    if (!isValidDomain(queryUrl)) {
      setError(
        "لطفاً فقط لینک محصولات از آمازون امارات، شئین یا نون امارات را وارد کنید.",
      );
      setData(null);
      setLoading(false);
      return;
    }

    let isSubscribed = true;

    setLoading(true);
    setData(null);
    setError(null);

    const fetchData = async () => {
      try {
        const result = await scrapeProduct(queryUrl);

        if (!isSubscribed) return; // Prevent state updates if URL changed again

        if (result.success === false) {
          setError(result.error || "خطا در استخراج اطلاعات");
          setData(null);
        } else {
          setData(result.data);
        }
      } catch (err) {
        if (!isSubscribed) return;
        setError(err.message || "خطای غیرمنتظره در سرور");
        setData(null);
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function to prevent race conditions if user changes URL rapidly
    return () => {
      isSubscribed = false;
    };
  }, [queryUrl]);

  const handleScrape = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams);

    if (inputValue) {
      params.set("url", inputValue);
    } else {
      params.delete("url");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleReset = () => {
    router.push(pathname, { scroll: false });
  };
  const storeName = data ? getStoreName(data.url) : getStoreName(url);
  const currency = data ? getCurrency(data.url) : "درهم";

  const currentPrice = useMemo(() => data?.pricing?.currentPrice || 0, [data]);
  const beforeDiscountPrice = useMemo(
    () => data?.pricing?.beforeDiscountPrice || 0,
    [data],
  );
  const discountPercentage = useMemo(
    () => data?.pricing?.discountPercentage || 0,
    [data],
  );
  const savings = useMemo(() => data?.pricing?.savedAmount || 0, [data]);

  // Extract images safely
  const mainImage =
    data?.images?.find((img) => img.type === "main")?.url ||
    data?.images?.[0]?.url;
  const galleryImages =
    data?.images?.filter((img) => img.type === "gallery") || [];

  // Combine productDetails (object) and detailBullets (array) for unified display
  const combinedDetails = useMemo(() => {
    if (!data) return {};
    const details = { ...(data.productDetails || {}) };
    if (Array.isArray(data.detailBullets)) {
      data.detailBullets.forEach((bullet, idx) => {
        details[`ویژگی ${idx + 1}`] = bullet;
      });
    }
    return details;
  }, [data]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" dir="rtl">
      {/* 1. Search Bar (ONLY shown when no data is loaded and not loading) */}
      {!data && !loading && (
        <Card className="mb-4 shadow-sm border-primary/20">
          <CardContent className="pt-6">
            <div className="mb-4 text-center">
              <h2 className="text-xl font-bold text-foreground">
                استخراج و سفارش محصول
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                لینک محصول را از آمازون امارات، شئین یا نون وارد کنید
              </p>
            </div>
            <form
              onSubmit={handleScrape}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Input
                type="url"
                placeholder="https://www.amazon.ae/... یا https://www.noon.com/uae-en/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 h-12 text-left dir-ltr font-mono text-sm"
                required
              />
              <Button
                type="submit"
                disabled={loading || !url}
                className="h-12 px-8 gap-2 bg-primary hover:bg-primary/90 font-semibold"
              >
                <IconSearch size={20} />
                <span>استخراج اطلاعات</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <IconAlertCircle className="h-4 w-4" />
          <AlertTitle>خطا</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading Skeleton */}
      {loading && !data && (
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-3 aspect-square bg-muted rounded-2xl" />
            <div className="lg:col-span-6 space-y-4">
              <div className="h-10 bg-muted rounded w-3/4" />
              <div className="h-32 bg-muted rounded-xl" />
            </div>
            <div className="lg:col-span-3 h-64 bg-muted rounded-2xl" />
          </div>
        </div>
      )}

      {/* 2. Product Data Display (3-Column RTL Layout) */}
      {data && !loading && (
        <div className="space-y-8">
          {/* Back to Search Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="gap-2 text-muted-foreground hover:text-primary"
          >
            <IconArrowRight size={16} />
            <span>جستجوی یک محصول جدید</span>
          </Button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <span className="hover:text-primary cursor-pointer transition-colors">
              خانه
            </span>
            <IconChevronLeft size={14} />
            <span className="hover:text-primary cursor-pointer transition-colors">
              سفارش از فروشگاه‌های خارجی
            </span>
            <IconChevronLeft size={14} />
            <span className="text-foreground font-medium">{storeName}</span>
          </nav>

          {/* Product Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>کد محصول:</span>
              <span className="font-mono bg-muted px-2 py-0.5 rounded-md">
                {data.productDetails?.ASIN ||
                  data.productDetails?.["Model Number"] ||
                  "N/A"}
              </span>
              <Badge variant="outline" className="mr-2 text-xs">
                {storeName}
              </Badge>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-relaxed text-foreground">
              {data.productTitle}
            </h1>
          </div>

          {/* Main 3-Column Grid (RTL: Right -> Center -> Left) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* RIGHT COLUMN: Image Gallery */}
            <div className="lg:col-span-3 space-y-4  sticky top-36">
              <div className="bg-white rounded-2xl border p-4 flex items-center justify-center relative group shadow-sm">
                <img
                  src={mainImage || "/placeholder.png"}
                  alt={data.productTitle}
                  className="max-w-full max-h-[400px] object-contain transition-transform duration-300 group-hover:scale-105"
                />
                {discountPercentage > 0 && (
                  <Badge className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-bold shadow-md">
                    {Math.round(discountPercentage)}% تخفیف
                  </Badge>
                )}
              </div>
              {galleryImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {galleryImages.slice(0, 5).map((img, idx) => (
                    <button
                      key={idx}
                      className="flex-shrink-0 size-16 md:size-20 border rounded-xl overflow-hidden bg-white hover:border-primary hover:ring-2 hover:ring-primary/20 transition-all p-1"
                    >
                      <img
                        src={img.url}
                        alt={`تصویر ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CENTER COLUMN: Product Info */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                  درباره این محصول
                </h2>
                <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground mr-2">
                  <li>• ارسال مستقیم از {storeName} با تضمین اصالت کالا</li>
                  <li>• گارانتی معتبر شرکتی و پشتیبانی ۷ روزه ویژ مارکت</li>
                  <li>
                    • قیمت نهایی شامل تمامی هزینه‌های گمرکی و حمل‌ونقل می‌باشد
                  </li>
                  {data.productDetails?.["Included Components"] && (
                    <li>
                      • اقلام همراه:{" "}
                      {data.productDetails["Included Components"]}
                    </li>
                  )}
                </ul>
              </div>

              <Separator />

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: IconRefresh, text: "۷ روز امکان بازگشت کالا" },
                  { icon: IconTruck, text: "ارسال اکسپرس به ایران" },
                  { icon: IconClock, text: "تضمین زمان تحویل کالا" },
                  { icon: IconShieldCheck, text: "۱۰۰٪ اصالت کالا" },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border/50 hover:bg-muted/60 transition-colors"
                  >
                    <badge.icon
                      size={20}
                      className="text-primary flex-shrink-0"
                    />
                    <span className="text-xs font-semibold leading-tight text-foreground">
                      {badge.text}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Technical Specifications Preview */}
              {(data.productDetails || data.detailBullets) && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                    مشخصات فنی کلیدی
                  </h2>
                  <Card className="overflow-hidden border-border/50">
                    <CardContent className="p-0">
                      <div className="divide-y divide-border max-h-96 overflow-y-auto">
                        {Object.entries(combinedDetails)
                          .filter(([key, value]) => isValidDetail(value))
                          .map(([key, value], index) => (
                            <div
                              key={key}
                              className={`grid grid-cols-[140px_1fr] p-4 text-sm ${
                                index % 2 === 0
                                  ? "bg-muted/30"
                                  : "bg-background"
                              }`}
                            >
                              <span className="font-semibold text-muted-foreground pl-4">
                                {key
                                  .replace(/\n/g, " ")
                                  .replace(/‏/g, "")
                                  .trim()}
                              </span>
                              <span className="text-foreground break-words">
                                {value
                                  .replace(/\n/g, " ")
                                  .replace(/‏/g, "")
                                  .trim()}
                              </span>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* LEFT COLUMN: CTA / Buy Box */}
            <div className="lg:col-span-3 sticky top-36">
              <Card className="border-primary/20 bg-muted/20 shadow-lg sticky top-24">
                <CardContent className="space-y-5">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground font-medium">
                      قیمت کالا در {storeName}:
                    </span>
                    <div className="flex flex-col items-center gap-2">
                      {beforeDiscountPrice > 0 && (
                        <span className="text-sm text-muted-foreground pt-0.5 line-through decoration-red-500">
                          {beforeDiscountPrice.toLocaleString()} {currency}
                        </span>
                      )}
                      <span className="text-2xl font-black text-primary">
                        {currentPrice > 0
                          ? `${currentPrice.toLocaleString()} ${currency}`
                          : "نامشخص"}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-1">
                    <span className="text-sm font-bold text-foreground">
                      قیمت نهایی (تومان):
                    </span>
                    <span className="text-3xl font-black text-foreground block">
                      {formatToman(currentPrice)}{" "}
                      <span className="text-sm">تومان</span>
                    </span>
                  </div>

                  {savings > 0 && (
                    <div className="flex items-center justify-between text-xs bg-green-50 text-green-700 p-2 rounded-lg border border-green-200">
                      <span className="font-medium">سود شما از خرید:</span>
                      <span className="font-bold">
                        {Math.round(savings).toLocaleString()} {currency}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                    <div>
                      <span className="text-muted-foreground block mb-1">
                        وزن:
                      </span>
                      <span className="font-semibold text-foreground">
                        {data.productDetails?.["Item Weight"] || "نامشخص"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">
                        مبدا:
                      </span>
                      <span className="font-semibold text-foreground">
                        {storeName}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <Button>
                      <IconShoppingCart size={20} />
                      افزودن به سبد خرید
                    </Button>
                    <a
                      href={data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full h-11 gap-2 border-primary/30 text-primary hover:bg-primary/5 font-medium"
                      >
                        <IconLink size={18} />
                        مشاهده در فروشگاه اصلی
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-8" />
        </div>
      )}
    </div>
  );
}
