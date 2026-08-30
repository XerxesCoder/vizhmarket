import OrderManager from "@/components/admin/order-manager";
import { getAdminOrders } from "@/lib/data/admin-store";

export const metadata = { title: "سفارش‌های فروشگاه | ویژ مارکت" };

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();
  return <OrderManager orders={orders} />;
}
