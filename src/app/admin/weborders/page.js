import { IconWorld } from "@tabler/icons-react";

export const metadata = { title: "سفارش‌های وب | ویژ مارکت" };

export default function AdminWebOrdersPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
      <IconWorld size={48} />
      <p className="font-medium text-foreground">سفارش‌های وب</p>
      <p className="text-sm">این بخش به‌زودی آماده می‌شود.</p>
    </div>
  );
}
