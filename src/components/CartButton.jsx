"use client";
import { IconShoppingCart } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { toPersianDigits } from "@/lib/utils";
import { useCartStore, useMounted } from "@/lib/cart-store";
import { useRouter } from "next/navigation";

export default function CartButton() {
  const router = useRouter();
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);
  const count = mounted ? items.reduce((sum, i) => sum + i.quantity, 0) : 0;

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={`سبد خرید${count > 0 ? ` (${count} محصول)` : ""}`}
      onClick={() => router.push("/cart")}
    >
      <IconShoppingCart size={22} />
      {count > 0 && (
        <span
          className="absolute -top-0.5 -left-0.5 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center tabular-nums"
          aria-hidden="true"
        >
          {toPersianDigits(count)}
        </span>
      )}
    </Button>
  );
}
