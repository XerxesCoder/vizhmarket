import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconHome, IconSearchOff } from "@tabler/icons-react";

// Admin 404 — renders inside the admin layout (sidebar stays visible)
export default function AdminNotFound() {
  return (
    <div dir="rtl" className="flex flex-col items-center justify-center gap-5 py-24 text-center">
      <div className="rounded-full bg-muted border border-border/50 p-6 text-muted-foreground">
        <IconSearchOff size={40} strokeWidth={1.8} />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold">صفحه پیدا نشد</h2>
        <p className="text-sm text-muted-foreground max-w-md leading-6">
          بخشی که به دنبال آن هستید در پنل مدیریت وجود ندارد یا حذف شده است.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button render={<Link href="/admin" />}>
          <IconHome size={16} />
          بازگشت به داشبورد
        </Button>
        <Button variant="outline" render={<Link href="/admin/products" />}>
          مدیریت محصولات
        </Button>
      </div>
    </div>
  );
}