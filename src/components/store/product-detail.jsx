"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCartStore } from "@/lib/cart-store";
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { SectionProductCard } from "@/components/store/section-product-card";
import {
  IconShoppingCart,
  IconBolt,
  IconPackageOff,
  IconCheck,
  IconExternalLink,
  IconPlus,
  IconMinus,
  IconTruck,
} from "@tabler/icons-react";

function formatIrr(value) {
  return new Intl.NumberFormat("fa-IR").format(Math.round(value));
}
function splitSpec(entry) {
  const idx = entry.indexOf(":");
  if (idx === -1) return { key: entry.trim(), value: "" };
  return {
    key: entry.slice(0, idx).trim(),
    value: entry.slice(idx + 1).trim(),
  };
}

function QuantityStepper({ quantity, setQuantity, stock, compact = false }) {
  const btn =
    "flex items-center justify-center rounded-lg border border-border text-foreground/80 hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
  const size = compact ? "h-9 w-9" : "h-10 w-10";
  return (
    <div
      className="inline-flex items-center gap-1 rounded-xl border border-border bg-background p-1"
      dir="ltr"
    >
      <button
        type="button"
        aria-label="کاهش تعداد"
        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        disabled={quantity <= 1}
        className={`${btn} ${size}`}
      >
        <IconMinus size={16} />
      </button>
      <span
        className={`min-w-8 text-center font-semibold tabular-nums ${compact ? "text-sm" : "text-base"}`}
        aria-live="polite"
      >
        {formatIrr(quantity)}
      </span>
      <button
        type="button"
        aria-label="افزایش تعداد"
        onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
        disabled={quantity >= stock}
        className={`${btn} ${size}`}
      >
        <IconPlus size={16} />
      </button>
    </div>
  );
}

export default function ProductDetail({ product }) {
  const defaultVariant =
    product.variants.find((v) => v.isDefault && v.stock > 0) ||
    product.variants.find((v) => v.stock > 0) ||
    product.variants[0] ||
    null;

  const [selectedVariantId, setSelectedVariantId] = useState(
    defaultVariant?.id ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const selectedVariant = useMemo(
    () => product.variants.find((v) => v.id === selectedVariantId) ?? null,
    [product.variants, selectedVariantId],
  );
  const gallery = useMemo(() => {
    const variantImgs = product.variants.flatMap((v) => v.images ?? []);
    const combined = [...(product.images ?? []), ...variantImgs];
    const deduped = [...new Set(combined)];
    if (selectedVariant?.images?.length) {
      const vImgs = selectedVariant.images;
      return [...vImgs, ...deduped.filter((x) => !vImgs.includes(x))];
    }
    return deduped;
  }, [product]);

  const mainImage = gallery[Math.min(activeImage, gallery.length - 1)];
  const irrPrice = useMemo(
    () => (selectedVariant ? selectedVariant.irrPrice || null : null),
    [selectedVariant],
  );
  const aedPrice = useMemo(
    () => (selectedVariant ? selectedVariant.aedPrice : null),
    [selectedVariant],
  );
  const stock = useMemo(
    () => (selectedVariant ? selectedVariant.stock : 0),
    [selectedVariant],
  );
  const inStock = stock > 0;
  const maxQty = Math.max(1, stock);
  const qty = Math.min(quantity, maxQty);
  const totalIrr = irrPrice != null ? irrPrice * qty : null;
  const deliveryText = product.isExpress
    ? "ارسال ۱ تا ۳ روز کاری"
    : "ارسال ۱۵ تا ۳۰ روز کاری";

  const ctaRef = useRef(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  useEffect(() => {
    const el = ctaRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const addItem = useCartStore((s) => s.addItem);
  const [justAdded, setJustAdded] = useState(false);
  const addedTimer = useRef(null);
  function handleAddToCart() {
    if (!selectedVariant) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      slug: product.slug,
      categorySlug: product.category?.slug,
      title: product.title,
      image: mainImage ?? product.images?.[0] ?? null,
      variantLabel:
        selectedVariant.attributes?.map((a) => a.value).join(" / ") || null,
      irrPrice: selectedVariant.irrPrice,
      aedPrice: selectedVariant.aedPrice,
      stock,
      quantity: qty,
    });
    setJustAdded(true);
    clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setJustAdded(false), 2000);
  }
  useEffect(() => () => clearTimeout(addedTimer.current), []);

  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Gallery — object-contain, no crop, full square */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-border/50 flex items-center justify-center">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.title}
                width={640}
                height={640}
                priority
                className="w-full h-full object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                <IconPackageOff size={48} />
              </div>
            )}
            {product.isExpress && (
              <Badge
                variant="secondary"
                className="absolute top-4 left-4 gap-1"
              >
                <IconBolt size={14} /> ارسال اکسپرس
              </Badge>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  aria-label={`تصویر ${i + 1}`}
                  className={`shrink-0 h-16 w-16 rounded-xl overflow-hidden border-2 bg-white transition-colors ${i === activeImage ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} ${i + 1}`}
                    width={64}
                    height={64}
                    loading="lazy"
                    className="h-full w-full object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {product.category?.name}
            </p>
            <h1 className="text-2xl font-black leading-9">{product.title}</h1>
            {product.brand && (
              <p className="text-sm text-muted-foreground mt-1">
                برند:{" "}
                <span className="font-medium text-foreground/80" dir="ltr">
                  {product.brand}
                </span>
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {product.sku && (
                <p className="text-xs text-muted-foreground" dir="ltr">
                  SKU: {product.sku}
                </p>
              )}
              {(product.totalSold ?? 0) > 0 && (
                <Badge variant="secondary" className="text-[10px]">
                  {formatIrr(product.totalSold)} فروش
                </Badge>
              )}
              <Badge variant="outline" className="gap-1 text-xs">
                <IconTruck size={14} /> {deliveryText}
              </Badge>
            </div>
            {product.url && (
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-2 w-fit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
              >
                <IconExternalLink size={14} /> مشاهده در فروشگاه اصلی
              </a>
            )}
          </div>

          {product.variants.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">انتخاب ویژگی:</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const isSelected = v.id === selectedVariantId;
                  const disabled = v.stock <= 0;
                  const label =
                    v.attributes.map((a) => a.value).join(" / ") || "—";
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariantId(v.id);
                        setActiveImage(0);
                        setQuantity(1);
                      }}
                      disabled={disabled}
                      className={`relative px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${isSelected ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed"}`}
                    >
                      {label}
                      {isSelected && (
                        <IconCheck
                          size={14}
                          className="inline me-1 text-primary"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <Card>
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  {irrPrice != null ? (
                    <p className="text-2xl font-black text-primary tabular-nums">
                      {formatIrr(irrPrice)}
                      <span className="text-sm font-normal ms-1">تومان</span>
                    </p>
                  ) : (
                    <p className="text-lg text-muted-foreground">
                      {product.variants.length > 0
                        ? "ویژگی مورد نظر را انتخاب کنید"
                        : "برای قیمت تماس بگیرید"}
                    </p>
                  )}
                  {aedPrice != null && (
                    <p className="text-xs text-muted-foreground mt-1">
                      پرداخت به درهم: {aedPrice.toLocaleString("fa-IR")} AED
                    </p>
                  )}
                </div>
                <Badge
                  variant={inStock ? "secondary" : "destructive"}
                  className="text-xs px-3 py-1.5"
                >
                  {inStock ? `${formatIrr(stock)} عدد موجود` : "ناموجود"}
                </Badge>
              </div>
              {inStock && irrPrice != null && (
                <div className="flex items-center justify-between gap-4 border-t border-border/50 pt-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      تعداد:
                    </span>
                    <QuantityStepper
                      quantity={qty}
                      setQuantity={setQuantity}
                      stock={maxQty}
                    />
                  </div>
                  {quantity > 1 && (
                    <p className="text-sm text-muted-foreground tabular-nums">
                      جمع:{" "}
                      <span className="font-bold text-foreground">
                        {formatIrr(totalIrr)}
                      </span>{" "}
                      تومان
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <IconTruck size={14} /> {deliveryText}
          </p>

          <Button
            ref={ctaRef}
            size="lg"
            disabled={!inStock}
            onClick={handleAddToCart}
            className="gap-2 w-full md:w-auto"
          >
            <IconShoppingCart size={20} />
            {justAdded
              ? "به سبد اضافه شد ✓"
              : inStock
                ? "افزودن به سبد خرید"
                : "ناموجود"}
          </Button>

        </div>
      </div>

      {(product.description || product.specs?.length > 0) && (
        <div className="mt-10 col-span-full">
          <Separator />
          <Tabs defaultValue="description" className="mt-6">
            <TabsList>
              <TabsTrigger value="description">توضیحات</TabsTrigger>
              <TabsTrigger value="specs">مشخصات</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              {product.description ? <p className="text-sm leading-7 text-foreground/80 whitespace-pre-line">{product.description}</p> : <p className="text-sm text-muted-foreground">توضیحاتی ثبت نشده است.</p>}
            </TabsContent>
            <TabsContent value="specs" className="mt-4">
              {product.specs?.length > 0 ? (
                <Table>
                  <TableHeader><TableRow></TableRow></TableHeader>
                  <TableBody>{product.specs.map((spec, i) => { const { key, value } = splitSpec(spec); return <TableRow key={i}><TableCell className="text-foreground/80 font-medium">{key || "—"}</TableCell><TableCell>{value || "—"}</TableCell></TableRow>; })}</TableBody>
                </Table>
              ) : <p className="text-sm text-muted-foreground">مشخصاتی ثبت نشده است.</p>}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {product.related?.length > 0 && (
        <div className="mt-12">
          <Separator />
          <h2 className="mt-6 text-lg font-black">محصولات مرتبط</h2>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {product.related.map((p) => (
              <SectionProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <div className={`md:hidden fixed bottom-0 inset-x-0 z-50 bg-background border-t shadow-[0_-4px_24px_rgba(0,0,0,0.08)] transition-transform duration-300 ${showStickyBar ? "translate-y-0" : "translate-y-full"}`} style={{ paddingBottom: "env(safe-area-inset-bottom)" }} aria-hidden={!showStickyBar}>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-muted-foreground truncate">{product.title}</p>
            {inStock && totalIrr != null ? <p className="text-sm font-black text-primary tabular-nums">{formatIrr(totalIrr)} <span className="text-[11px] font-normal">تومان</span></p> : <Badge variant="destructive" className="text-[11px] mt-1">ناموجود</Badge>}
          </div>
          <Button disabled={!inStock} onClick={handleAddToCart} size="lg" className="shrink-0 rounded-2xl px-5 h-11 text-sm font-bold">
            <IconShoppingCart size={18} />{justAdded ? "اضافه شد ✓" : "افزودن به سبد"}
          </Button>
        </div>
      </div>
    </div>
  );
}
