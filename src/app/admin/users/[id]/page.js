import { notFound } from "next/navigation";
import UserOrders from "@/components/admin/user-orders";
import { getAdminUserOrders } from "@/lib/data/admin-store";

export const metadata = { title: "سفارش‌های کاربر | ویژ مارکت" };

export default async function AdminUserOrdersPage({ params }) {
  const { id } = await params;
  const user = await getAdminUserOrders(id);
  if (!user) notFound();

  return <UserOrders user={user} />;
}