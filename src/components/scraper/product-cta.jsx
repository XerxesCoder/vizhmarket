// components/scraper/product-cta.jsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  IconShoppingCart,
  IconLink,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import { calculateFinalPrice, formatToman } from "@/lib/scraper-helpers";

export default function ProductCTA({
  storeName,
  currency,
  currentPrice,
  beforeDiscountPrice,
  savings,
  data,
}) {
  const [quantity, setQuantity] = useState(1);

  const pricing = calculateFinalPrice(currentPrice * quantity, 15, 30);
  const hasDiscount = beforeDiscountPrice > 0;

  return (
    <div className="lg:col-span-3">
      <Card className="sticky top-24 border-primary/10 shadow-lg shadow-primary/5">
        <CardContent className="p-6 space-y-5">
          {/* Store Price */}
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              قیمت در {storeName}
            </span>
            <div className="flex flex-col gap-1">
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {beforeDiscountPrice.toLocaleString()} {currency}
                </span>
              )}
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-foreground">
                  {currentPrice > 0
                    ? `${currentPrice.toLocaleString()} ${currency}`
                    : "نامشخص"}
                </span>
                {hasDiscount && (
                  <Badge variant="destructive" className="text-xs px-2 py-0.5">
                    {
                      Math.round(
                        ((beforeDiscountPrice - currentPrice) /
                          beforeDiscountPrice) *
                          100
                      )
                    }%-
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Savings Display */}
          {savings > 0 && (
            <div className="flex items-center justify-between text-sm p-3 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
              <span className="font-medium text-green-700 dark:text-green-400">
                🎉 سود شما از خرید
              </span>
              <span className="font-bold text-green-600 dark:text-green-300">
                {Math.round(savings).toLocaleString()} {currency}
              </span>
            </div>
          )}

          <Separator />

          {/* Quantity Selector */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">تعداد</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="rounded-lg size-8"
              >
                <IconMinus size={14} />
              </Button>
              <span className="w-10 text-center font-bold text-lg">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                disabled={quantity >= 99}
                className="rounded-lg size-8"
              >
                <IconPlus size={14} />
              </Button>
            </div>
          </div>

          {/* Final Price in Toman */}
          <div className="space-y-1 p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <span className="text-xs text-muted-foreground">
              قیمت نهایی (تومان) — شامل حمل و گمرک
            </span>
            <span className="text-3xl font-black block text-primary">
              {pricing.formattedFinalToman}
              <span className="text-base font-bold mr-1">تومان</span>
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-xl bg-muted/30">
              <span className="text-muted-foreground block mb-1 text-xs">
                وزن
              </span>
              <span className="font-semibold text-foreground">
                {data.productDetails?.["Item Weight"] || "نامشخص"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-muted/30">
              <span className="text-muted-foreground block mb-1 text-xs">
                مبدا
              </span>
              <span className="font-semibold text-foreground">{storeName}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <Button size="lg" className="w-full h-13 gap-3 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all">
              <IconShoppingCart size={20} />
              افزودن به سبد خرید
            </Button>
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button
                variant="outline"
                className="w-full gap-2 h-12 rounded-xl"
              >
                <IconLink size={18} />
                مشاهده در فروشگاه اصلی
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
