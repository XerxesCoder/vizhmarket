"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  IconTrash,
  IconPlus,
  IconMinus,
  IconShoppingCart,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useCartStore, useMounted } from "@/lib/cart-store";

function formatIrr(value) {
  return new Intl.NumberFormat("fa-IR").format(Math.round(value));
}

export default function CartView() {
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const totalIrr = useMemo(
    () => items.reduce((sum, i) => sum + i.irrPrice * i.quantity, 0),
    [items],
  );
  const totalAed = useMemo(
    () => items.reduce((sum, i) => sum + i.aedPrice * i.quantity, 0),
    [items],
  );
  const totalQty = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  // Avoid hydration mismatch: localStorage cart only exists on the client
  if (!mounted) {
    return (
      <div dir="rtl" className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
        <div className="h-8 w-40 rounded-lg bg-muted animate-pulse mb-8" />
        <div className="h-32 rounded-2xl bg-muted animate-pulse" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        dir="rtl"
        className="max-w-5xl mx-auto px-4 lg:px-8 py-20 text-center"
      >
        <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
          <IconShoppingCart size={36} className="text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-black mb-2">سبد خرید شما خالی است</h1>
        <p className="text-muted-foreground mb-8">
          از فروشگاه دیدن کنید و محصولات مورد علاقه‌تان را اضافه کنید.
        </p>
        <Button asChild className="gap-2" size="lg">
          <Link href="/store">
            <IconArrowLeft size={18} />
            رفتن به فروشگاه
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">سبد خرید</h1>
        <Badge variant="secondary" className="tabular-nums">
          {formatIrr(totalQty)} محصول
        </Badge>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Items */}
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <CartRow
              key={item.key}
              item={item}
              setQuantity={setQuantity}
              removeItem={removeItem}
            />
          ))}
        </div>

        {/* Summary */}
        <Card className="lg:sticky lg:top-28">
          <CardContent className="p-5 flex flex-col gap-3">
            <h2 className="font-bold">خلاصه سفارش</h2>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">جمع محصولات</span>
              <span className="tabular-nums">{formatIrr(totalQty)} عدد</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">مبلغ قابل پرداخت</span>
              <span className="font-black text-primary tabular-nums">
                {formatIrr(totalIrr)} تومان
              </span>
            </div>
            {totalAed > 0 && (
              <p className="text-xs text-muted-foreground tabular-nums">
                معادل: {totalAed.toLocaleString("fa-IR")} AED
              </p>
            )}
            <Button asChild size="lg" className="w-full gap-2 mt-2">
              <Link href="/checkout">
                <IconArrowLeft size={18} />
                ادامه و پرداخت
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link href="/store">ادامه خرید</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CartRow({ item, setQuantity, removeItem }) {
  const href = `/store/${item.categorySlug}/${item.slug}`;
  return (
    <Card>
      <CardContent className="p-4 flex gap-4 items-center">
        <Link
          href={href}
          className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-muted"
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              width={80}
              height={80}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-muted-foreground">
              <IconShoppingCart size={24} />
            </span>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <Link
            href={href}
            className="font-bold line-clamp-1 hover:text-primary transition-colors"
          >
            {item.title}
          </Link>
          {item.variantLabel && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {item.variantLabel}
            </p>
          )}
          <p className="text-sm text-primary font-semibold tabular-nums mt-1">
            {formatIrr(item.irrPrice)} تومان
          </p>
        </div>

        {/* Quantity stepper */}
        <div
          className="flex items-center gap-1 rounded-xl border border-border p-1"
          dir="ltr"
        >
          <button
            type="button"
            aria-label="کاهش تعداد"
            onClick={() => setQuantity(item.key, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <IconMinus size={14} />
          </button>
          <span className="min-w-7 text-center text-sm font-bold tabular-nums">
            {formatIrr(item.quantity)}
          </span>
          <button
            type="button"
            aria-label="افزایش تعداد"
            onClick={() => setQuantity(item.key, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <IconPlus size={14} />
          </button>
        </div>

        <div className="hidden sm:flex flex-col items-end gap-1">
          <p className="text-sm font-black tabular-nums">
            {formatIrr(item.irrPrice * item.quantity)} تومان
          </p>
          <button
            type="button"
            aria-label={`حذف ${item.title} از سبد`}
            onClick={() => removeItem(item.key)}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <IconTrash size={16} />
          </button>
        </div>
      </CardContent>
      {/* Mobile remove row */}
      <div className="sm:hidden flex justify-end px-4 pb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeItem(item.key)}
          className="gap-1 text-destructive hover:text-destructive"
        >
          <IconTrash size={14} />
          حذف
        </Button>
      </div>
    </Card>
  );
}
