"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";

// Admin error boundary — catches render/data errors in any admin section
export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error("Admin section error:", error);
  }, [error]);

  return (
    <div dir="rtl" className="flex flex-col items-center justify-center gap-5 py-24 text-center">
      <div className="rounded-full bg-destructive/10 border border-destructive/30 p-6 text-destructive">
        <IconAlertTriangle size={40} strokeWidth={1.8} />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold">خطایی رخ داد</h2>
        <p className="text-sm text-muted-foreground max-w-md leading-6">
          در بارگذاری این بخش مشکلی پیش آمد. می‌توانید دوباره تلاش کنید؛ در صورت تکرار، با پشتیبانی تماس بگیرید.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={reset}>
          <IconRefresh size={16} />
          تلاش دوباره
        </Button>
        <Button variant="outline" render={<Link href="/admin" />}>
          بازگشت به داشبورد
        </Button>
      </div>
    </div>
  );
}