/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { IconAlertCircle } from "@tabler/icons-react";
import { scrapeAmazonProduct as scrapeProduct } from "@/app/actions/amazonScraper";

import {
  isValidDomain,
  getStoreName,
  getCurrency,
} from "@/lib/scraper-helpers";

import SearchForm from "./search-form";
import ProductSkeleton from "./product-skeleton";
import ProductHeader from "./product-header";
import ProductGallery from "./product-gallery";
import ProductInfo from "./product-info";
import ProductCTA from "./product-cta";

export default function OrderProductView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryUrl = searchParams.get("url") || "";

  const [inputValue, setInputValue] = useState(queryUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Sync input field when URL changes via browser navigation
  useEffect(() => {
    setInputValue(queryUrl);
  }, [queryUrl]);

  // Fetch product data whenever the URL param changes (single source of truth)
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

    let cancelled = false;
    setLoading(true);
    setData(null);
    setError(null);

    const fetchData = async () => {
      try {
        const result = await scrapeProduct(queryUrl);
        console.log(result);
        if (cancelled) return;
        if (result.data?.productTitle == "Not found") {
          setError(result.error || "خطا در استخراج اطلاعات");
          setData(null);
        }
        if (result.success === false) {
          setError(result.error || "خطا در استخراج اطلاعات");
          setData(null);
        } else {
          setData(result.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "خطای غیرمنتظره در سرور");
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [queryUrl]);

  const handleScrape = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (inputValue) {
      params.set("url", inputValue);
    } else {
      params.delete("url");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleReset = () => {
    router.replace(pathname, { scroll: false });
  };

  // Derived data
  const storeName = data ? getStoreName(data.url) : getStoreName(queryUrl);
  const currency = data ? getCurrency(data.url) : "درهم";

  const currentPrice = data?.pricing?.currentPrice || 0;
  const beforeDiscountPrice = data?.pricing?.beforeDiscountPrice || 0;
  const discountPercentage = data?.pricing?.discountPercentage || 0;
  const savings = data?.pricing?.savedAmount || 0;

  const mainImage =
    data?.images?.find((img) => img.type === "main")?.url ||
    data?.images?.[0]?.url;

  const galleryImages =
    data?.images?.filter((img) => img.type === "gallery") || [];

  const detailsWithBullets = useMemo(() => {
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
      {!data && !loading && (
        <SearchForm
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSubmit={handleScrape}
          isLoading={loading}
        />
      )}

      {error && (
        <Alert variant="destructive">
          <IconAlertCircle className="h-4 w-4" />
          <AlertTitle>خطا</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && !data && <ProductSkeleton />}

      {data && !loading && (
        <div className="space-y-8">
          <ProductHeader
            storeName={storeName}
            data={data}
            onReset={handleReset}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <ProductGallery
              mainImage={mainImage}
              galleryImages={galleryImages}
              productTitle={data.productTitle}
              discountPercentage={discountPercentage}
            />

            <ProductInfo
              storeName={storeName}
              combinedDetails={detailsWithBullets}
            />

            <ProductCTA
              storeName={storeName}
              currency={currency}
              currentPrice={currentPrice}
              beforeDiscountPrice={beforeDiscountPrice}
              savings={savings}
              data={data}
            />
          </div>

          <Separator className="my-8" />
        </div>
      )}
    </div>
  );
}
