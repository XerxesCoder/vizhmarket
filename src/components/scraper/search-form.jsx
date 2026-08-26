// components/scraper/search-form.jsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconSearch, IconLink } from "@tabler/icons-react";

const STORE_CHIPS = [
  { label: "آمازون امارات", domain: "amazon.ae" },
  { label: "شئین (Shein)", domain: "shein.com" },
  { label: "نون (Noon)", domain: "noon.com" },
];

export default function SearchForm({
  inputValue,
  setInputValue,
  onSubmit,
  isLoading,
}) {
  return (
    <section className="w-full py-16 md:py-24 flex justify-center items-center">
      <Card className="w-full max-w-2xl border-primary/10 shadow-xl shadow-primary/5">
        <CardContent className="p-8 md:p-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <Badge variant="secondary" className="mb-2 px-3 py-1 text-xs">
              🚀 استخراج و سفارش محصول
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold">
              لینک محصول را وارد کنید
            </h2>
            <p className="text-sm text-muted-foreground">
              از آمازون امارات، شئین یا نون امارات
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="url"
                placeholder="https://www.amazon.ae/..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
                dir="ltr"
                className="w-full h-14 pl-12 pr-4 text-sm font-mono rounded-2xl bg-muted/50 border-primary/20 focus:border-primary transition-colors"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <IconLink size={18} />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !inputValue}
              size="lg"
              className="w-full h-14 text-base font-bold gap-3 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  در حال استخراج...
                </span>
              ) : (
                <>
                  <IconSearch size={22} />
                  استخراج اطلاعات محصول
                </>
              )}
            </Button>
          </form>

          {/* Store Quick-select */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">فروشگاه‌های مورد پشتیبانی</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {STORE_CHIPS.map((store) => (
                <Badge
                  key={store.domain}
                  variant="outline"
                  className="px-3 py-1.5 text-xs cursor-default border-primary/20 text-muted-foreground"
                >
                  {store.label}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
