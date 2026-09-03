"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconAlertTriangle, IconRefresh, IconHome } from "@tabler/icons-react";

// Site-wide error boundary
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div dir="rtl" className="flex flex-col items-center justify-center gap-5 py-24 text-center px-6">
      <div className="rounded-full bg-destructive/10 border border-destructive/30 p-6 text-destructive">
        <IconAlertTriangle size={40} strokeWidth={1.8} />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold">خطایی رخ داد</h2>
        <p className="text-sm text-muted-foreground max-w-md leading-6">
          در بارگذاری این صفحه مشکلی پیش آمد. می‌توانید دوباره تلاش کنید؛ در صورت تکرار، با پشتیبانی تماس بگیرید.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={reset}>
          <IconRefresh size={16} />
          تلاش دوباره
        </Button>
        <Button variant="outline" render={<Link href="/" />}>
          <IconHome size={16} />
          بازگشت به خانه
        </Button>
      </div>
    </div>
  );
}