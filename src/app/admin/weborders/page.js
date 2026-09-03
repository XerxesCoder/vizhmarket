import { Badge } from "@/components/ui/badge";
import { IconWorld, IconClock, IconSparkles, IconPackage, IconCreditCard, IconTruck } from "@tabler/icons-react";

export const metadata = { title: "سفارش‌های وب | ویژ مارکت" };

const STATS = [
  { label: "سفارش فعال", value: "—", icon: IconPackage },
  { label: "در انتظار پرداخت", value: "—", icon: IconCreditCard },
  { label: "ارسال‌شده", value: "—", icon: IconTruck },
];

const FEATURES = [
  "ثبت لینک محصول خارجی و برآورد قیمت",
  "پیگیری وضعیت از خرید تا تحویل",
  "اتصال به درگاه پرداخت و مدیریت مرجوعی",
];

export default function AdminWebOrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold tracking-tight">سفارش‌های وب</h1>
          <p className="text-sm text-muted-foreground mt-1">سفارش‌های ثبت‌شده از طریق لینک خارجی (آمازون و سایر فروشگاه‌ها)</p>
        </div>
        <Badge variant="secondary" className="rounded-full gap-1.5 py-1 px-3">
          <IconClock size={14} /> به‌زودی
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border/50 bg-card p-4 flex items-center gap-3">
            <span className="size-10 rounded-2xl bg-muted border border-border/50 flex items-center justify-center shrink-0">
              <s.icon size={18} className="text-muted-foreground" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <span className="text-lg font-bold tabular-nums">{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/50 bg-card p-8 sm:p-10 flex flex-col items-center text-center gap-4">
        <span className="size-14 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center">
          <IconWorld size={26} className="text-primary" />
        </span>
        <div className="flex flex-col gap-1.5 max-w-md">
          <h2 className="font-bold text-base">این بخش در حال آماده‌سازی است</h2>
          <p className="text-sm text-muted-foreground leading-6">
            مدیریت سفارش‌های وب به‌زودی فعال می‌شود. پس از راه‌اندازی می‌توانید لینک‌ها، قیمت‌گذاری و وضعیت ارسال را از همین صفحه مدیریت کنید.
          </p>
        </div>
        <ul className="flex flex-col gap-2 text-sm text-muted-foreground text-right w-full max-w-sm mt-2">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2 rounded-xl bg-muted/50 border border-border/50 px-3 py-2.5">
              <IconSparkles size={14} className="text-primary shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
