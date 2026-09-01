"use client";

import Image from "next/image";

export default function Loading() {
  return (
    <div className="relative h-screen w-full bg-background flex flex-col items-center justify-center gap-6 p-4 overflow-hidden">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 dark:bg-[linear-gradient(to_right,##ffffff40_1px,transparent_1px),linear-gradient(to_bottom,##ffffff40_1px,transparent_1px)] 
        bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:48px_48px]"
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative">
          {/*          <Image
            src={Logo}
            width={150}
            height={152}
            alt="دستگیره هوشمند کوبه"
            priority
          /> */}
        </div>

        {/* Loading text with animated dots */}
        <div className="flex flex-col items-center gap-3 mt-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-sm font-medium">در حال بارگذاری</span>
          </div>

          {/* Brand name */}
          <p>دستگیره هوشمند کوبه</p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden mt-2">
          <div className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full" />
        </div>
      </div>
    </div>
  );
}
