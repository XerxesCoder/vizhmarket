// components/scraper/product-header.jsx
import { Badge } from "@/components/ui/badge";
import { IconChevronLeft, IconArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function ProductHeader({ storeName, data, onReset }) {
  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onReset} className="gap-2">
        <IconArrowRight size={16} />
        <span>جستجوی یک محصول جدید</span>
      </Button>

      <nav className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <span>خانه</span>
        <IconChevronLeft size={14} />
        <span>سفارش از فروشگاه‌های خارجی</span>
        <IconChevronLeft size={14} />
        <span className="font-medium text-foreground">{storeName}</span>
      </nav>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>کد محصول:</span>
          <span className="font-mono bg-muted px-2 py-0.5 rounded">
            {data.productDetails?.ASIN ||
              data.productDetails?.["Model Number"] ||
              "N/A"}
          </span>
          <Badge variant="outline">{storeName}</Badge>
        </div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-relaxed text-foreground">
          {data.productTitle}
        </h1>
      </div>
    </div>
  );
}
