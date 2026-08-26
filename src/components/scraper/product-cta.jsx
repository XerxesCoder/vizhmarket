// components/scraper/product-cta.jsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IconShoppingCart, IconLink } from "@tabler/icons-react";
import { calculateFinalPrice, formatToman } from "@/lib/scraper-helpers";

export default function ProductCTA({
  storeName,
  currency,
  currentPrice,
  beforeDiscountPrice,
  savings,
  data,
}) {
  const pricing = calculateFinalPrice(currentPrice, 15, 30);

  return (
    <div className="lg:col-span-3">
      <Card className="sticky top-24">
        <CardContent className="p-5 space-y-5">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">
              قیمت کالا در {storeName}:
            </span>
            <div className="flex flex-col items-center gap-2">
              {beforeDiscountPrice > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  {beforeDiscountPrice.toLocaleString()} {currency}
                </span>
              )}
              <span className="text-2xl font-bold text-foreground">
                {currentPrice > 0
                  ? `${currentPrice.toLocaleString()} ${currency}`
                  : "نامشخص"}
              </span>
            </div>
            {savings > 0 && (
              <div className="flex items-center justify-between text-sm p-2 rounded border bg-muted">
                <span className="font-medium">سود شما از خرید:</span>
                <span className="font-bold">
                  {Math.round(savings).toLocaleString()} {currency}
                </span>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-1">
            <span className="text-sm font-medium">قیمت نهایی (تومان):</span>
            <span className="text-3xl font-bold block text-foreground">
              {pricing.formattedFinalToman}{" "}
              <span className="text-sm">تومان</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm pt-2">
            <div>
              <span className="text-muted-foreground block mb-1">وزن:</span>
              <span className="font-medium text-foreground">
                {data.productDetails?.["Item Weight"] || "نامشخص"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">مبدا:</span>
              <span className="font-medium text-foreground">{storeName}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button className="w-full">
              <IconShoppingCart size={20} />
              افزودن به سبد خرید
            </Button>
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button variant="outline" className="w-full gap-2">
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
