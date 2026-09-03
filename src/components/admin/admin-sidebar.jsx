"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  IconPackage,
  IconCategory,
  IconUsers,
  IconShoppingCart,
  IconWorld,
  IconHome,
  IconLayoutDashboard,
  IconMenu2,
  IconSparkles,
  IconCoin,
} from "@tabler/icons-react";

const ADMIN_LINKS = [
  { href: "/admin", label: "داشبورد", icon: IconLayoutDashboard, exact: true },
  { href: "/admin/products", label: "محصولات", icon: IconPackage },
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: IconCategory },
  { href: "/admin/users", label: "کاربران", icon: IconUsers },
  { href: "/admin/orders", label: "سفارش‌های فروشگاه", icon: IconShoppingCart },
  { href: "/admin/weborders", label: "سفارش‌های وب", icon: IconWorld },
  { href: "/admin/exchange-rate", label: "نرخ درهم", icon: IconCoin },
];

function NavLinks({ pathname, onNavigate }) {
  return (
    <>
      {ADMIN_LINKS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon size={18} className={cn(active && "text-primary-foreground")} />
            {label}
          </Link>
        );
      })}
    </>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex lg:hidden fixed top-0 inset-x-0 z-30 h-14 items-center gap-2 border-b bg-background/80 backdrop-blur-md px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon-sm" aria-label="باز کردن منو" />}>
            <IconMenu2 size={20} />
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0 gap-0">
            <div className="p-5 border-b">
              <p className="font-black text-base text-primary flex items-center gap-2"><IconSparkles size={18} /> پنل مدیریت</p>
              <p className="text-xs text-muted-foreground mt-1">ویژ مارکت — مدیریت فروشگاه</p>
            </div>
            <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
              <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            </nav>
            <div className="p-3 border-t">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
                <IconHome size={18} /> بازگشت به سایت
              </Link>
            </div>
          </SheetContent>
        </Sheet>
        <span className="font-bold text-sm">پنل مدیریت</span>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col sticky top-0 h-screen border-l bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/80">
        <div className="p-6 border-b">
          <Link href="/admin" className="flex items-center gap-2.5 font-black text-lg tracking-tight">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground"><IconSparkles size={16} /></span>
            پنل مدیریت
          </Link>
          <p className="text-xs text-muted-foreground mt-1.5">ویژ مارکت — مدیریت فروشگاه</p>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
          <NavLinks pathname={pathname} />
        </nav>
        <div className="p-3 border-t">
          <Link href="/" className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <IconHome size={18} /> بازگشت به سایت
          </Link>
        </div>
      </aside>
    </>
  );
}
