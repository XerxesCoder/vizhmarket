"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/cart-store";
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  IconShoppingCart,
  IconBolt,
  IconPackageOff,
  IconChevronLeft,
  IconCheck,
  IconExternalLink,
  IconPlus,
  IconMinus,
} from "@tabler/icons-react";

function formatIrr(value) {
  return new Intl.NumberFormat("fa-IR").format(Math.round(value));
}

// Splits a stored "key: value" spec entry into { key, value } for the table.
function splitSpec(entry) {
  const idx = entry.indexOf(":");
  if (idx === -1) return { key: entry.trim(), value: "" };
  return {
    key: entry.slice(0, idx).trim(),
    value: entry.slice(idx + 1).trim(),
  };
}

// Shared quantity stepper (used inline + in the mobile sticky bar)
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

  // Price, stock & gallery all come from the selected variant
  const selectedVariant = useMemo(
    () => product.variants.find((v) => v.id === selectedVariantId) ?? null,
    [product.variants, selectedVariantId],
  );

  // Gallery: variant images take priority when a variant is selected, otherwise product images
  const gallery = useMemo(
    () =>
      selectedVariant?.images?.length > 0
        ? selectedVariant.images
        : product.images?.length > 0
          ? product.images
          : [],
    [selectedVariant, product.images],
  );
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

  // Clamp the stored quantity to what the selected variant can actually supply
  const maxQty = Math.max(1, stock);
  const qty = Math.min(quantity, maxQty);
  const totalIrr = irrPrice != null ? irrPrice * qty : null;
  // Mobile sticky bar: show when the inline add-to-cart button scrolls out of view
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
        {/* Gallery */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.title}
                width={640}
                height={640}
                fetchPriority="high"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
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
                  className={`shrink-0 h-16 w-16 rounded-xl overflow-hidden border-2 transition-colors ${
                    i === activeImage
                      ? "border-primary"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={product.title}
                    width={64}
                    height={64}
                    loading="lazy"
                    className="h-full w-full object-cover"
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
            <div className="flex items-center gap-2 mt-2">
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
            </div>
            {product.url && (
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-2 w-fit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
              >
                <IconExternalLink size={14} />
                مشاهده در فروشگاه اصلی
              </a>
            )}
          </div>

          {/* Variant selector */}
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
                      className={`relative px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed"
                      }`}
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

          {/* Price + stock + quantity */}
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

          <Button
            ref={ctaRef}
            size="lg"
            disabled={!inStock}
            onClick={handleAddToCart}
            className="gap-2 w-full md:w-auto"
          >
            <IconShoppingCart size={20} />
            {justAdded ? "به سبد اضافه شد ✓" : inStock ? "افزودن به سبد خرید" : "ناموجود"}
          </Button>

          {product.description && (
            <>
              <Separator />
              <div>
                <h2 className="font-bold mb-2">توضیحات</h2>
                <p className="text-sm leading-7 text-foreground/80 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {product.specs?.length > 0 && (
        <div className="mt-10">
          <Separator />
          <div className="mt-6">
            <h2 className="font-bold mb-4">مشخصات محصول</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  {/*           <TableHead className="w-1/2">ویژگی</TableHead>
                  <TableHead>مقدار</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.specs.map((spec, i) => {
                  const { key, value } = splitSpec(spec);
                  return (
                    <TableRow key={i}>
                      <TableCell className="text-foreground/80 font-medium">
                        {key || "—"}
                      </TableCell>
                      <TableCell>{value || "—"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Mobile sticky add-to-cart bar — appears when the inline button is scrolled past */}
      <div
        className={`md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-transform duration-300 ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-hidden={!showStickyBar}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1.5 min-w-0">
            {inStock ? (
              totalIrr != null && (
                <p className="text-base font-black text-primary tabular-nums truncate">
                  {formatIrr(totalIrr)}
                  <span className="text-xs font-normal ms-1">تومان</span>
                </p>
              )
            ) : (
              <Badge
                variant="destructive"
                className="text-xs px-2 py-0.5 w-fit"
              >
                ناموجود
              </Badge>
            )}
            {inStock && (
              <span className="text-[11px] text-muted-foreground">
                تعداد: {formatIrr(qty)} از {formatIrr(stock)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {inStock && (
              <QuantityStepper
                quantity={qty}
                setQuantity={setQuantity}
                stock={maxQty}
                compact
              />
            )}
            <Button
              disabled={!inStock}
              onClick={handleAddToCart}
              className="gap-1.5 px-4"
              aria-label="افزودن به سبد خرید"
            >
              <IconShoppingCart size={18} />
              <span className="hidden min-[380px]:inline">
                {justAdded ? "اضافه شد ✓" : "افزودن به سبد"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
