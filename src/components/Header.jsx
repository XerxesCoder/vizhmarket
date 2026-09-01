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
  IconPackage,
  IconCategory,
  IconUser,
  IconChevronDown,
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
import CartButton from "./CartButton";

const NAV_LINKS = [
  { id: 0, href: "/", label: "خانه", icon: IconHome },
  { id: 1, href: "/store", label: "فروشگاه", icon: IconPackage },
  { id: 2, href: "/order", label: "سفارش محصول", icon: IconShoppingCart },
  { id: 3, href: "#", label: "درباره ما", icon: IconInfoCircle },
  { id: 4, href: "#", label: "تماس با ما", icon: IconPhone },
];

export default function Header({ categories = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [desktopQuery, setDesktopQuery] = useState("");
  const [mobileQuery, setMobileQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [expandedCats, setExpandedCats] = useState(new Set());

  const handleSearch = (query, e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (isValidDomain(trimmed)) {
      setMobileQuery("");
      setDesktopQuery("");
      router.push(`/order?url=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(`/store?search=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleNavClick = (href) => {
    setSheetOpen(false);
    if (href && !href.startsWith("#")) router.push(href);
  };

  const toggleCat = (id) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isCatActive = (slug) => pathname === `/store/${slug}`;
  const isParentActive = (cat) =>
    isCatActive(cat.slug) ||
    (cat.children && cat.children.some((c) => isCatActive(c.slug)));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="flex items-center justify-between px-4 lg:px-8 py-3 gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/" className="shrink-0">
            <span className="text-2xl font-black text-primary tracking-tighter">
              ویژ مارکت
            </span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              "px-3 py-2 rounded-xl text-sm font-medium transition-colors",
              pathname === "/"
                ? "text-primary"
                : "text-foreground/70 hover:text-foreground",
            )}
          >
            خانه
          </Link>
          <Link
            href="/store"
            className={cn(
              "px-3 py-2 rounded-xl text-sm font-medium transition-colors",
              pathname === "/store"
                ? "text-primary"
                : "text-foreground/70 hover:text-foreground",
            )}
          >
            فروشگاه
          </Link>
          <Link
            href="/order"
            className={cn(
              "px-3 py-2 rounded-xl text-sm font-medium transition-colors",
              pathname.startsWith("/order")
                ? "text-primary"
                : "text-foreground/70 hover:text-foreground",
            )}
          >
            سفارش محصول
          </Link>
        </nav>

        {/* Desktop Search */}
        <form
          onSubmit={(e) => handleSearch(desktopQuery, e)}
          className="hidden md:flex flex-1 max-w-xl relative"
        >
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="جستجو در فروشگاه یا لینک محصول..."
              autoComplete="off"
              value={desktopQuery}
              onChange={(e) => setDesktopQuery(e.target.value)}
              className="w-full pr-12 pl-4 h-11 rounded-2xl bg-muted/50 border-none focus-visible:bg-background focus-visible:border transition-all text-sm"
            />
            <button
              type="submit"
              aria-label="جستجو"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            >
              <IconSearch size={18} />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="پروفایل من"
            onClick={() => router.push("/profile")}
          >
            <IconUser size={22} />
          </Button>
          <CartButton />
          <ModeToggle />
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden "
                  aria-label="منو"
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
                {NAV_LINKS.map(({ href, label, icon: Icon, id }) => (
                  <button
                    key={id}
                    onClick={() => handleNavClick(href)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all w-full text-right",
                      pathname === href
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon size={20} />
                    {label}
                  </button>
                ))}
              </nav>

              {categories.length > 0 && (
                <div className="px-3 pb-3">
                  <p className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-muted-foreground">
                    <IconCategory size={16} className="text-primary" />
                    دسته‌بندی‌ها
                  </p>
                  <div className="flex flex-col">
                    {categories.map((cat) => {
                      const isExpanded = expandedCats.has(cat.id);
                      const hasChildren =
                        cat.children && cat.children.length > 0;
                      const parentActive = isParentActive(cat);

                      return (
                        <div key={cat.id}>
                          <div className="flex items-center">
                            <Link
                              href={`/store/${cat.slug}`}
                              onClick={() => setSheetOpen(false)}
                              className={cn(
                                "flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors",
                                parentActive
                                  ? "text-primary font-semibold"
                                  : "text-foreground/80 hover:text-foreground",
                              )}
                            >
                              {cat.name}
                            </Link>
                            {hasChildren && (
                              <button
                                type="button"
                                onClick={() => toggleCat(cat.id)}
                                aria-label={
                                  isExpanded
                                    ? "بستن زیرمجموعه‌ها"
                                    : "باز کردن زیرمجموعه‌ها"
                                }
                                aria-expanded={isExpanded}
                                className="flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              >
                                <IconChevronDown
                                  size={16}
                                  className={cn(
                                    "transition-transform duration-200",
                                    isExpanded ? "rotate-180" : "rotate-0",
                                  )}
                                />
                              </button>
                            )}
                          </div>
                          {hasChildren && isExpanded && (
                            <div className="ps-5 flex flex-col animate-in slide-in-from-top-1 duration-200">
                              {cat.children.map((child) => (
                                <Link
                                  key={child.id}
                                  href={`/store/${child.slug}`}
                                  onClick={() => setSheetOpen(false)}
                                  className={cn(
                                    "px-4 py-2 rounded-lg text-xs transition-colors",
                                    isCatActive(child.slug)
                                      ? "text-primary font-semibold bg-primary/5"
                                      : "text-muted-foreground hover:text-primary hover:bg-muted",
                                  )}
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-auto p-6 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  ویژ مارکت — خرید مستقیم از آمازون
                </p>
              </div>
            </SheetContent>
          </Sheet>
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
            autoComplete="off"
            value={mobileQuery}
            onChange={(e) => setMobileQuery(e.target.value)}
            className="w-full pr-10 pl-4 h-10 rounded-xl bg-muted/40 border-none text-sm"
          />
          <button
            type="submit"
            aria-label="جستجو"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
          >
            <IconSearch size={16} />
          </button>
        </div>
      </form>

      {categories.length > 0 && (
        <div className="border-t border-border/50 bg-background/60">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center gap-1 overflow-x-auto py-2">
            <Link
              href="/store"
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors",
                pathname === "/store"
                  ? "text-primary bg-primary/10 hover:bg-primary/15 font-bold "
                  : "",
              )}
            >
              <IconCategory size={14} />
              همه دسته‌بندی‌ها
            </Link>
            {categories.map((cat) => {
              const active = isParentActive(cat);
              return (
                <Link
                  key={cat.id}
                  href={`/store/${cat.slug}`}
                  className={cn(
                    "shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    active
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted",
                  )}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
