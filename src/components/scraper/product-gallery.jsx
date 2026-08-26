// components/scraper/product-gallery.jsx
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ProductGallery({
  mainImage,
  galleryImages,
  productTitle,
  discountPercentage,
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Build the full image list: main first, then gallery images
  const allImages = [
    { url: mainImage, type: "main" },
    ...galleryImages,
  ].filter((img) => img.url);

  const currentImage = allImages[selectedIndex] || allImages[0];

  return (
    <div className="lg:col-span-3 space-y-4">
      {/* Main Image */}
      <Card className="overflow-hidden group">
        <CardContent className="p-0 flex items-center justify-center relative bg-muted/20 min-h-[300px]">
          <img
            src={currentImage?.url || "/placeholder.png"}
            alt={productTitle}
            className="max-w-full max-h-[400px] w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
          {discountPercentage > 0 && (
            <Badge
              variant="destructive"
              className="absolute top-4 right-4 text-sm px-3 py-1 shadow-lg"
            >
              {Math.round(discountPercentage)}% تخفیف
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Thumbnail Strip */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "flex-shrink-0 size-16 md:size-20 rounded-xl border-2 overflow-hidden transition-all duration-200 p-0.5 bg-background",
                idx === selectedIndex
                  ? "border-primary shadow-md ring-1 ring-primary/20"
                  : "border-border hover:border-muted-foreground/30 opacity-70 hover:opacity-100"
              )}
            >
              <img
                src={img.url}
                alt={`${productTitle} - تصویر ${idx + 1}`}
                className="w-full h-full object-contain rounded-lg"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
