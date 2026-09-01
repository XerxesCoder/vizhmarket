"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  IconCircleCheck,
  IconX,
  IconArrowLeft,
  IconClock,
  IconLoader2,
  IconRefresh,
} from "@tabler/icons-react";
import { createZarinpalPayment } from "@/lib/actions/payments";
import { useCartStore } from "@/lib/cart-store";

function formatIrr(value) {
  return new Intl.NumberFormat("fa-IR").format(Math.round(value));
}

const STATUS_LABELS = {
  SUBMITTED: "در انتظار پرداخت",
  PAID: "پرداخت شده",
  CANCELLED: "لغو شده",
};

export default function PaymentResult({ status, auth, reason, order }) {
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState(null);
  const clear = useCartStore((s) => s.clear);
  const showOrder = Boolean(order);

  async function payAgain() {
    if (!order?.id) return;
    setRetryError(null);
    setRetrying(true);
    const pay = await createZarinpalPayment(order.id);
    if (pay?.error || !pay?.url) {
      setRetrying(false);
      setRetryError(pay?.error || "خطا در اتصال به درگاه پرداخت");
      return;
    }
    window.location.href = pay.url;
  }
  useEffect(() => {
    if (order && order?.status !== "SUBMITTED") {
      clear();
    }
  }, [order, clear]);

  const canRetry = showOrder && order.status === "SUBMITTED";

  // ── Success ──
  if (status === "success") {
    return (
      <div dir="rtl" className="max-w-2xl mx-auto px-4 py-14">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <IconCircleCheck size={40} className="text-primary" />
          </div>
          <h1 className="text-2xl font-black mb-2">
            پرداخت با موفقیت انجام شد
          </h1>
          <p className="text-muted-foreground">
            سفارش شما نهایی شد و به‌زودی ارسال می‌شود.
          </p>
        </div>

        {showOrder && <OrderSummary order={order} />}

        {order?.zarinpalref && (
          <p
            className="text-xs text-muted-foreground text-center mt-4"
            dir="ltr"
          >
            شماره پیگیری پرداخت:{" "}
            <span className="font-bold text-foreground">
              {order.zarinpalref}
            </span>
          </p>
        )}

        <div className="text-center mt-8">
          <Button render={<Link href="/store" />} size="lg" className="gap-2">
            <IconArrowLeft size={18} />
            بازگشت به فروشگاه
          </Button>
        </div>
      </div>
    );
  }

  // ── Cancelled / failed ──
  const cancelled = status === "cancelled";

  return (
    <div dir="rtl" className="max-w-2xl mx-auto px-4 py-14">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          {cancelled ? (
            <IconClock size={40} className="text-destructive" />
          ) : (
            <IconX size={40} className="text-destructive" />
          )}
        </div>
        <h1 className="text-2xl font-black mb-2">
          {cancelled ? "پرداخت لغو شد" : "پرداخت با خطا مواجه شد"}
        </h1>
        <p className="text-muted-foreground">
          {cancelled
            ? "پرداخت انجام نشد، اما سفارش شما ثبت مانده و می‌توانید دوباره پرداخت کنید."
            : "متأسفانه پرداخت تأیید نشد. در صورت تکرار خطا با پشتیبانی تماس بگیرید."}
        </p>
        {status === "error" && !order && (
          <p className="text-xs text-muted-foreground mt-2">
            {reason ? `علت: ${reason}` : `کد تراکنش: ${auth ?? "-"}`}
          </p>
        )}
      </div>

      {showOrder && <OrderSummary order={order} />}

      {retryError && (
        <p
          role="alert"
          className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2 mt-4 text-center"
        >
          {retryError}
        </p>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
        {/*         {canRetry && (
          <Button
            onClick={payAgain}
            size="lg"
            className="gap-2"
            disabled={retrying}
          >
            {retrying ? (
              <IconLoader2 size={18} className="animate-spin" />
            ) : (
              <IconRefresh size={18} />
            )}
            {retrying ? "در حال انتقال به درگاه..." : "پرداخت مجدد"}
          </Button>
        )} */}
        <Button
          render={<Link href="/cart" />}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <IconArrowLeft size={18} />
          بازگشت به سبد خرید
        </Button>
      </div>
    </div>
  );
}

// Shared order summary card (items + total + status) — used on success & failure
function OrderSummary({ order }) {
  console.log(order);
  return (
    <Card>
      <CardContent className="p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-[11px]">
              {STATUS_LABELS[order.status] ?? order.status}
            </Badge>
            <span className="text-xs text-muted-foreground" dir="ltr">
              #{formatIrr(order.id)}
            </span>
          </div>
          <p className="text-sm font-black text-primary tabular-nums">
            {formatIrr(order.total)} تومان
          </p>
        </div>
        <Separator />
        <ul className="flex flex-col gap-2">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <span className="shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-muted">
                {item.product?.images?.[0] && (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    width={48}
                    height={48}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                )}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium line-clamp-1">
                  {item.product?.title ?? "محصول حذف شده"}
                </span>
                {item.variant?.attributes?.length > 0 && (
                  <span className="block text-[11px] text-muted-foreground">
                    {item.variant.attributes.map((a) => a.value).join(" / ")}
                  </span>
                )}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {formatIrr(item.quantity)} × {formatIrr(item.unitIrrPrice)}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
