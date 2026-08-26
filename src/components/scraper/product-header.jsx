// components/scraper/product-header.jsx
import { Badge } from "@/components/ui/badge";
import { IconChevronLeft, IconArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function ProductHeader({ storeName, data, onReset }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <IconArrowRight size={16} />
        <span>جستجوی محصول جدید</span>
      </Button>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <span className="hover:text-foreground transition-colors cursor-default">خانه</span>
        <IconChevronLeft size={14} className="opacity-50" />
        <span className="hover:text-foreground transition-colors cursor-default">سفارش از فروشگاه‌های خارجی</span>
        <IconChevronLeft size={14} className="opacity-50" />
        <span className="font-semibold text-foreground">{storeName}</span>
      </nav>

      {/* Title & Meta */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <span>کد محصول:</span>
          <span className="font-mono text-xs bg-muted px-2.5 py-1 rounded-md border">
            {data.productDetails?.ASIN ||
              data.productDetails?.["Model Number"] ||
              "N/A"}
          </span>
          <Badge
            variant="secondary"
            className="text-[11px] px-2.5 py-0.5"
          >
            {storeName}
          </Badge>
        </div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-relaxed text-foreground">
          {data.productTitle}
        </h1>
      </div>
    </div>
  );
}
