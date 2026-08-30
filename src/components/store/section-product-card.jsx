import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { IconBolt } from "@tabler/icons-react";

function formatIrr(value) {
  return new Intl.NumberFormat("fa-IR").format(Math.round(value));
}

// Product card used on landing/category sections (variant-based pricing)
export function SectionProductCard({ product, horizontal = false }) {
  const variantPrices = product.variants.map((v) => v.irrPrice || v.aedPrice);
  const irrPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : null;
  const inStock = product.variants.some((v) => v.stock > 0);
  const variantCount = product.variants.length;

  return (
    <Link
      href={`/store/${product.category?.slug ?? "all"}/${product.slug}`}
      className="group block bg-background rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.images[0]}
          alt={product.title}
          width={320}
          height={320}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.isExpress && (
          <Badge variant="secondary" className="absolute top-2 left-2 gap-1 text-[9px]">
            <IconBolt size={11} /> اکسپرس
          </Badge>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <Badge variant="destructive">ناموجود</Badge>
          </div>
        )}
      </div>

      <div className={horizontal ? "p-3 space-y-1.5" : "p-3.5 space-y-2"}>
        <p className="text-[10px] text-muted-foreground truncate">
          {product.category?.name}
        </p>
        <p className="font-semibold text-[13px] line-clamp-1 leading-5">
          {product.title}
        </p>
        <div className="flex items-center justify-between">
          {irrPrice != null ? (
            <p className="font-bold text-primary text-[13px]">
              {formatIrr(irrPrice)}
              <span className="text-[9px] font-normal ms-0.5">تومان</span>
            </p>
          ) : (
            <p className="text-[11px] text-muted-foreground">تماس بگیرید</p>
          )}
          {variantCount > 0 && (
            <span className="text-[9px] text-muted-foreground">
              {formatIrr(variantCount)} ویژگی
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
