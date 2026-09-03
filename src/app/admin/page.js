import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminStats } from "@/lib/data/admin-store";
import { IconPackage, IconUsers, IconClock, IconCoin } from "@tabler/icons-react";

export const metadata = { title: "داشبورد مدیریت | ویژ مارکت" };

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  const fmt = (n) => new Intl.NumberFormat("fa-IR").format(n);
  const cards = [
    { href: "/admin/users", label: "کاربران", value: fmt(stats.users), icon: IconUsers },
    { href: "/admin/products", label: "محصولات", value: fmt(stats.products), icon: IconPackage },
    { href: "/admin/orders", label: "سفارش‌های در انتظار", value: fmt(stats.pendingOrders), icon: IconClock },
    { href: "/admin/orders", label: "مجموع فروش (تومان)", value: `${fmt(Math.round(stats.totalSold))} تومان`, icon: IconCoin },
  ];
  return (
    <div className="flex flex-col gap-6 pt-12 lg:pt-0">
      <h1 className="font-black text-2xl">داشبورد</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ href, label, value, icon: Icon }) => (
          <Link key={label} href={href} className="group">
            <Card className="rounded-2xl border-border/50 group-hover:shadow-md transition-all">
              <CardContent className="p-5 flex items-center justify-between">
                <div><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-black tabular-nums mt-1">{value}</p></div>
                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Icon size={20} /></div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
