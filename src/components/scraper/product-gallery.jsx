// components/scraper/product-gallery.jsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductGallery({
  mainImage,
  galleryImages,
  productTitle,
  discountPercentage,
}) {
  return (
    <div className="lg:col-span-3 space-y-4">
      <Card>
        <CardContent className="p-4 flex items-center justify-center relative">
          <img
            src={mainImage || "/placeholder.png"}
            alt={productTitle}
            className="max-w-full max-h-[400px] object-contain"
          />
          {discountPercentage > 0 && (
            <Badge variant="destructive" className="absolute top-4 right-4">
              {Math.round(discountPercentage)}% تخفیف
            </Badge>
          )}
        </CardContent>
      </Card>

      {galleryImages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {galleryImages.slice(0, 5).map((img, idx) => (
            <Card key={idx} className="flex-shrink-0 size-16 md:size-20 p-1">
              <CardContent className="p-0 h-full flex items-center justify-center">
                <img
                  src={img.url}
                  alt={`تصویر ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
