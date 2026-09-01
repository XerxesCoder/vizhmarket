"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  IconArrowLeft,
  IconCheck,
  IconCircleCheck,
  IconLoader2,
  IconShoppingCart,
} from "@tabler/icons-react";
import { createStoreOrder } from "@/lib/actions/order-actions";
import { createZarinpalPayment } from "@/lib/actions/payments";
import { useCartStore, useMounted } from "@/lib/cart-store";

function formatIrr(value) {
  return new Intl.NumberFormat("fa-IR").format(Math.round(value));
}

const EMPTY_FORM = {
  customerName: "",
  province: "",
  city: "",
  phone: "",
  email: "",
  note: "",
};

export default function CheckoutForm() {
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

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

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const name = form.customerName.trim();
    const province = form.province.trim();
    const city = form.city.trim();
    const fullAddress = form.fullAddress.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();
    const note = form.note.trim();

    if (!name) return setError("نام و نام خانوادگی الزامی است");
    if (!province) return setError("استان الزامی است");
    if (!fullAddress) return setError("آدرس الزامی است");
    if (!city) return setError("شهر الزامی است");
    if (!/^0?9\d{9}$/.test(phone.replace(/[\s-]/g, "")))
      return setError("شماره موبایل معتبر وارد کنید (مثل ۰۹۱۲۳۴۵۶۷۸۹)");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("ایمیل معتبر وارد کنید");

    setPending(true);
    const shippingAddress = [province, city, fullAddress].join("، ");
    const result = await createStoreOrder({
      customerName: name,
      customerPhone: phone,
      customerEmail: email || undefined,
      note: note,
      shippingAddress,
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
      })),
    });
    if (result?.error) {
      setPending(false);
      setError(result.error);
      return;
    }
    const pay = await createZarinpalPayment(result.orderId);
    if (pay?.error) {
      setPending(false);
      setError(pay.error);
      return;
    }
    //clear();
    window.location.href = pay.url;
  }

  if (orderId) {
    return (
      <div dir="rtl" className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <IconCircleCheck size={40} className="text-primary" />
        </div>
        <h1 className="text-2xl font-black mb-2">سفارش شما ثبت شد</h1>
        <p className="text-muted-foreground mb-6">
          کارشناسان ما به‌زودی برای هماهنگی ارسال با شما تماس می‌گیرند.
        </p>
        <p className="text-sm text-muted-foreground mb-8" dir="ltr">
          کد پیگیری:{" "}
          <span className="font-bold text-foreground">{orderId}</span>
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link href="/store">
            <IconArrowLeft size={18} />
            رفتن به فروشگاه
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <CheckoutBody
      mounted={mounted}
      items={items}
      totalIrr={totalIrr}
      totalAed={totalAed}
      totalQty={totalQty}
      form={form}
      setField={setField}
      error={error}
      pending={pending}
      handleSubmit={handleSubmit}
    />
  );
}

function CheckoutBody({
  mounted,
  items,
  totalIrr,
  totalAed,
  totalQty,
  form,
  setField,
  error,
  pending,
  handleSubmit,
}) {
  // ---- Hydration guard / empty cart ----
  if (!mounted) {
    return (
      <div dir="rtl" className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
        <div className="h-8 w-40 rounded-lg bg-muted animate-pulse mb-8" />
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="h-96 rounded-2xl bg-muted animate-pulse" />
          <div className="h-48 rounded-2xl bg-muted animate-pulse" />
        </div>
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
          برای ثبت سفارش ابتدا محصولی به سبد خرید اضافه کنید.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link href={"/store"}>
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
        <h1 className="text-2xl font-black">تکمیل سفارش</h1>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/cart">بازگشت به سبد</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Customer info */}
          <Card>
            <CardContent className="p-5 flex flex-col gap-4">
              <h2 className="font-bold">اطلاعات گیرنده</h2>
              <Separator />
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label htmlFor="customerName">
                    نام و نام خانوادگی{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="customerName"
                    value={form.customerName}
                    onChange={setField("customerName")}
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="province">
                    استان <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="province"
                    value={form.province}
                    onChange={setField("province")}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="city">
                    شهر <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={setField("city")}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label htmlFor="address">
                    آدرس <span className="text-xs text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    rows={3}
                    placeholder=" آدرس دقیق،و..."
                    value={form.fullAddress}
                    onChange={setField("fullAddress")}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone">
                    شماره موبایل <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    dir="ltr"
                    inputMode="tel"
                    placeholder="09123456789"
                    value={form.phone}
                    onChange={setField("phone")}
                    required
                    autoComplete="tel"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">
                    ایمیل{" "}
                    <span className="text-xs text-muted-foreground">
                      (اختیاری)
                    </span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    dir="ltr"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={setField("email")}
                    autoComplete="email"
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label htmlFor="note">
                    یادداشت{" "}
                    <span className="text-xs text-muted-foreground">
                      (اختیاری)
                    </span>
                  </Label>
                  <Textarea
                    id="note"
                    rows={3}
                    placeholder="مثلاً آدرس دقیق، ساعت مناسب تماس و..."
                    value={form.note}
                    onChange={setField("note")}
                  />
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2"
                >
                  {error}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Order summary */}
          <CheckoutSummary
            items={items}
            totalIrr={totalIrr}
            totalAed={totalAed}
            totalQty={totalQty}
            pending={pending}
          />
        </div>
      </form>
    </div>
  );
}

function CheckoutSummary({ items, totalIrr, totalAed, totalQty, pending }) {
  return (
    <Card className="lg:sticky lg:top-28">
      <CardContent className="p-5 flex flex-col gap-3">
        <h2 className="font-bold">سبد شما ({formatIrr(totalQty)} عدد)</h2>
        <Separator />
        <ul className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <li key={item.key} className="flex items-center gap-2.5">
              <span className="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-muted">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    width={40}
                    height={40}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                )}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-xs font-medium line-clamp-1">
                  {item.title}
                </span>
                <span className="block text-[11px] text-muted-foreground tabular-nums">
                  {formatIrr(item.quantity)} × {formatIrr(item.irrPrice)}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <Separator />
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
        <Button
          type="submit"
          size="lg"
          className="w-full gap-2 mt-2"
          disabled={pending}
        >
          {pending ? (
            <IconLoader2 size={18} className="animate-spin" />
          ) : (
            <IconCheck size={18} />
          )}
          {pending ? "در حال ثبت سفارش..." : "ثبت سفارش"}
        </Button>
        <p className="text-[11px] text-muted-foreground leading-5">
          پس از ثبت سفارش، کارشناسان ما برای تأیید و پرداخت با شما تماس
          می‌گیرند.
        </p>
      </CardContent>
    </Card>
  );
}
