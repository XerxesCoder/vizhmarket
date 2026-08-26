"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  IconSearch,
  IconShoppingCart,
  IconUser,
  IconMenu2,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "./theme/theme-toggle";
import { isValidDomain } from "@/lib/scraper-helpers";

export default function Header() {
  const router = useRouter();
  const [desktopQuery, setDesktopQuery] = useState("");
  const [mobileQuery, setMobileQuery] = useState("");

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

  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
      dir="rtl"
    >
      {/* Main Header: Logo, Search, Actions */}
      <div className="flex items-center justify-between px-4 lg:px-8 py-4 gap-4">
        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-3 flex-1">
          <Button variant="ghost" size="icon" className="md:hidden">
            <IconMenu2 size={24} />
          </Button>

          <Link href="/" className="shrink-0">
            <span className="text-2xl font-black text-primary tracking-tighter">
              ویژ مارکت
            </span>
          </Link>
        </div>

        {/* Search Bar (Desktop) */}
        <form
          onSubmit={(e) => handleSearch(desktopQuery, e)}
          className="hidden md:flex flex-1 max-w-2xl relative"
        >
          <Input
            type="text"
            placeholder="جستجو یا لینک محصول (amazon.ae, shein, noon)..."
            value={desktopQuery}
            onChange={(e) => setDesktopQuery(e.target.value)}
            className="w-full pr-10 pl-4 h-11 rounded-xl text-left dir-ltr"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
          >
            <IconSearch size={20} />
          </button>
        </form>

        {/* Actions: Login & Cart */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <Link href="/login">
            <Button
              variant="outline"
              className="gap-2 rounded-xl h-11 px-4 border-primary/20 hover:bg-primary/5 text-sm font-medium"
            >
              <IconUser size={20} />
              <span className="hidden sm:inline">ورود | ثبت‌نام</span>
            </Button>
          </Link>
          <ModeToggle />
          <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-xl h-11 w-11"
            >
              <IconShoppingCart size={22} />
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar (Mobile Only) */}
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
            className="w-full pr-10 pl-4 h-10 rounded-lg bg-muted/50 border-none text-left dir-ltr"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
          >
            <IconSearch size={18} />
          </button>
        </div>
      </form>
    </header>
  );
}
