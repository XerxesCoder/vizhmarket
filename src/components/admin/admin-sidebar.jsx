"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  IconPackage,
  IconCategory,
  IconUsers,
  IconShoppingCart,
  IconWorld,
  IconHome,
} from "@tabler/icons-react";

const ADMIN_LINKS = [
  { href: "/admin/products", label: "محصولات", icon: IconPackage },
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: IconCategory },
  { href: "/admin/users", label: "کاربران", icon: IconUsers },
  { href: "/admin/orders", label: "سفارش‌های فروشگاه", icon: IconShoppingCart },
  { href: "/admin/weborders", label: "سفارش‌های وب", icon: IconWorld },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-l bg-muted/30 min-h-[calc(100vh-0px)] sticky top-0 h-screen flex flex-col">
      <div className="p-5 border-b">
        <Link href="/admin" className="font-black text-lg text-primary">
          پنل مدیریت
        </Link>
        <p className="text-xs text-muted-foreground mt-0.5">ویژ مارکت</p>
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-1">
        {ADMIN_LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
        >
          <IconHome size={18} />
          بازگشت به سایت
        </Link>
      </div>
    </aside>
  );
}
