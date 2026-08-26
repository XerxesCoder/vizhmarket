"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  IconSearch,
  IconMenu2,
  IconHome,
  IconShoppingCart,
  IconInfoCircle,
  IconPhone,
  IconX,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./theme/theme-toggle";
import { isValidDomain } from "@/lib/scraper-helpers";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/", label: "خانه", icon: IconHome },
  { href: "/order", label: "سفارش محصول", icon: IconShoppingCart },
  { href: "#", label: "درباره ما", icon: IconInfoCircle },
  { href: "#", label: "تماس با ما", icon: IconPhone },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [desktopQuery, setDesktopQuery] = useState("");
  const [mobileQuery, setMobileQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleSearch = (query, e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (isValidDomain(trimmed)) {
      setMobileQuery("");
      setDesktopQuery("");
      router.push(`/order?url=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(`/order?search=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleNavClick = (href) => {
    setSheetOpen(false);
    if (href !== "#") router.push(href);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60"
      dir="rtl"
    >
      <div className="flex items-center justify-between px-4 lg:px-8 py-3 gap-4 max-w-7xl mx-auto">
        {/* Mobile Menu + Logo */}
        <div className="flex items-center gap-3">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-xl h-11 w-11"
                />
              }
            >
              <IconMenu2 size={22} />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetHeader className="p-6 pb-3 border-b">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-xl font-black text-primary">
                    ویژ مارکت
                  </SheetTitle>
                  <SheetClose
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="rounded-lg"
                      />
                    }
                  >
                    <IconX size={18} />
                  </SheetClose>
                </div>
              </SheetHeader>
              <nav className="flex flex-col p-3 gap-1">
                {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                  <button
                    key={href}
                    onClick={() => handleNavClick(href)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all w-full text-right",
                      pathname === href
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon size={20} />
                    {label}
                  </button>
                ))}
              </nav>
              <div className="mt-auto p-6 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  ویژ مارکت — خرید مستقیم از آمازون
                </p>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="shrink-0">
            <span className="text-2xl font-black text-primary tracking-tighter">
              ویژ مارکت
            </span>
          </Link>
        </div>

        {/* Desktop Search */}
        <form
          onSubmit={(e) => handleSearch(desktopQuery, e)}
          className="hidden md:flex flex-1 max-w-xl relative"
        >
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="جستجو یا لینک محصول..."
              value={desktopQuery}
              onChange={(e) => setDesktopQuery(e.target.value)}
              className="w-full pr-12 pl-4 h-11 rounded-2xl bg-muted/50 border-none focus-visible:bg-background focus-visible:border transition-all text-sm"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            >
              <IconSearch size={18} />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>

      {/* Mobile Search */}
      <form
        onSubmit={(e) => handleSearch(mobileQuery, e)}
        className="md:hidden px-4 pb-3"
      >
        <div className="relative">
          <Input
            type="text"
            placeholder="جستجو یا لینک محصول..."
            value={mobileQuery}
            onChange={(e) => setMobileQuery(e.target.value)}
            className="w-full pr-10 pl-4 h-10 rounded-xl bg-muted/40 border-none text-sm"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
          >
            <IconSearch size={16} />
          </button>
        </div>
      </form>
    </header>
  );
}