"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconFingerprint, IconHome, IconLockPlus } from "@tabler/icons-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex items-center justify-center p-6">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 dark:bg-[linear-gradient(to_right,##ffffff40_1px,transparent_1px),linear-gradient(to_bottom,##ffffff40_1px,transparent_1px)] 
        bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:48px_48px]"
      />
      <div className="relative z-10 max-w-2xl w-full text-center space-y-10">
        <div className="relative flex items-center justify-center">
          <span className="text-[180px] sm:text-[220px] font-black leading-none bg-gradient-to-b from-primary/50 via-primary/30 to-transparent bg-clip-text text-transparent select-none tracking-tighter">
            {404}
          </span>

          {/* Lock icon on top */}
          <div className="absolute">
            <div className="relative">
              {/* Lock */}
              <div className="relative bg-gradient-to-br rounded-full from-destructive/30 to-destructive/15 backdrop-blur-xl border border-destructive  p-6 shadow-2xl">
                <IconLockPlus
                  className="h-8 w-8 text-destructive"
                  strokeWidth={1.8}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight bg-gradient-to-l from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
            صحفه مورد نظر پیدا نشد
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
            به نظر می‌رسد صفحه‌ای که به دنبال آن هستید وجود ندارد.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 ">
          <Button size="lg" asChild>
            <Link href="/" className="w-full sm:w-auto">
              <IconHome className="h-4 w-4" />
              بازگشت به خانه
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/products" className="w-full sm:w-auto">
              <IconFingerprint className="h-4 w-4" />
              مشاهده دستیگره های هوشمند
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
