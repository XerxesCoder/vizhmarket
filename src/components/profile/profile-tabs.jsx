"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  IconPackage,
  IconWorld,
  IconLogout,
  IconArrowLeft,
} from "@tabler/icons-react";
import { logoutUser } from "@/lib/auth";

function formatIrr(value) {
  return new Intl.NumberFormat("fa-IR").format(Math.round(value));
}

function formatDate(date) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
  }).format(new Date(date));
}

const STATUS_LABELS = {
  SUBMITTED: "ثبت شده",
  PAID: "پرداخت شده",
  BOUGHT: "خریداری شده",
  SHIPPED_BY_STORE: "ارسال از فروشگاه",
  SHIPPED: "ارسال شده",
  DELIVERED: "تحویل شده",
  CANCELLED: "لغو شده",
};

function StatusBadge({ status }) {
  const tone =
    status === "DELIVERED"
      ? "secondary"
      : status === "CANCELLED"
        ? "destructive"
        : "secondary";
  return (
    <Badge variant={tone} className="text-[11px] px-2 py-0.5">
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}

export default function ProfileTabs({ user, storeOrders, webOrders }) {
  const [tab, setTab] = useState("store");
  const router = useRouter();

  return (
    <div dir="rtl" className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">پروفایل</h1>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground"
          onClick={async () => {
            await logoutUser();
            router.push("/login");
            router.refresh();
          }}
        >
          <IconLogout size={16} />
          خروج
        </Button>
      </div>

      <div className="flex items-center gap-2 rounded-2xl bg-muted p-1 w-fit mb-6">
        <TabButton active={tab === "store"} onClick={() => setTab("store")}>
          <IconPackage size={16} />
          سفارش‌های فروشگاه (
          {new Intl.NumberFormat("fa-IR").format(storeOrders.length)})
        </TabButton>
        <TabButton active={tab === "web"} onClick={() => setTab("web")}>
          <IconWorld size={16} />
          سفارش‌های آمازون (
          {new Intl.NumberFormat("fa-IR").format(webOrders.length)})
        </TabButton>
      </div>

      {tab === "store" ? (
        <StoreOrdersList orders={storeOrders} />
      ) : (
        <WebOrdersList orders={webOrders} />
      )}
    </div>
  );
}

// ── Store orders tab ──
function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
        active
          ? "bg-background shadow-sm text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function StoreOrdersList({ orders }) {
  if (orders.length === 0) {
    return (
      <EmptyState
        text="هنوز سفارشی از فروشگاه ثبت نکرده‌اید."
        href="/store"
        linkLabel="رفتن به فروشگاه"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => {
        const total = order.items.reduce(
          (sum, i) => sum + (i.unitIrrPrice ?? 0),
          0,
        );
        return (
          <Card key={order.id}>
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <span className="text-xs text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </span>
                  <span className="text-xs text-muted-foreground" dir="ltr">
                    #{formatIrr(order.id)}
                  </span>
                </div>
                <p className="text-sm font-black text-primary tabular-nums">
                  {formatIrr(total)} تومان
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
                      <Link
                        href={
                          item.product?.slug && item.product?.category?.slug
                            ? `/store/${item.product.category.slug}/${item.product.slug}`
                            : "#"
                        }
                        className="block text-sm font-medium line-clamp-1 hover:text-primary transition-colors"
                      >
                        {item.product?.title ?? "محصول حذف شده"}
                      </Link>
                      {item.variant?.attributes?.length > 0 && (
                        <span className="block text-[11px] text-muted-foreground">
                          {item.variant.attributes
                            .map((a) => a.value)
                            .join(" / ")}
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {formatIrr(item.quantity)} عدد
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ── Web (Amazon concierge) orders tab ──
function WebOrdersList({ orders }) {
  if (orders.length === 0) {
    return (
      <EmptyState
        text="هنوز سفارش آمازونی ثبت نکرده‌اید."
        href="/order"
        linkLabel="ثبت سفارش محصول"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <StatusBadge status={order.status} />
                <span className="text-xs text-muted-foreground">
                  {formatDate(order.createdAt)}
                </span>
                {order.store && (
                  <span className="text-xs text-muted-foreground" dir="ltr">
                    {order.store}
                  </span>
                )}
              </div>
              {order.totalIrrPrice != null && (
                <p className="text-sm font-black text-primary tabular-nums">
                  {formatIrr(order.totalIrrPrice)} تومان
                </p>
              )}
            </div>
            <Separator />
            <a
              href={order.requestedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium line-clamp-1 text-primary hover:underline w-fit"
              dir="ltr"
            >
              {order.requestedTitle || order.requestedUrl}
            </a>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
              {order.trackingNumber && (
                <span dir="ltr">
                  کد رهگیری:{" "}
                  <span className="font-medium text-foreground">
                    {order.trackingNumber}
                  </span>
                </span>
              )}
              {order.actualUrl && (
                <a
                  href={order.actualUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                  dir="ltr"
                >
                  لینک خرید واقعی
                </a>
              )}
              <span className="tabular-nums">
                تعداد: {formatIrr(order.quantity)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ text, href, linkLabel }) {
  return (
    <div className="rounded-3xl border border-border/50 bg-muted/30 py-16 text-center">
      <p className="text-muted-foreground mb-6">{text}</p>
      <Button asChild className="gap-2">
        <Link href={href}>
          <IconArrowLeft size={16} />
          {linkLabel}
        </Link>
      </Button>
    </div>
  );
}
