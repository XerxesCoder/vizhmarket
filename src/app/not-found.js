import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  IconHome,
  IconSearchOff,
  IconMasksTheaterOff,
} from "@tabler/icons-react";

// Site-wide 404
export default function NotFound() {
  return (
    <div
      dir="rtl"
      className="flex flex-col items-center justify-center gap-5 py-24 text-center px-6"
    >
      <div className="rounded-full bg-muted border border-border/50 p-6 text-muted-foreground">
        <IconSearchOff size={40} strokeWidth={1.8} />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold">صفحه پیدا نشد</h2>
        <p className="text-sm text-muted-foreground max-w-md leading-6">
          به نظر می‌رسد صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button render={<Link href="/" />}>
          <IconHome size={16} />
          بازگشت به خانه
        </Button>
        <Button variant="outline" render={<Link href="/store" />}>
          <IconMasksTheaterOff size={16} />
          مشاهده فروشگاه
        </Button>
      </div>
    </div>
  );
}
