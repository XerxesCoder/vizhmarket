import { Suspense } from "react";
import OrderProductView from "@/components/scraper/order-product-view";
import ProductSkeleton from "@/components/scraper/product-skeleton";

export default function OrderPage() {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <OrderProductView />
    </Suspense>
  );
}