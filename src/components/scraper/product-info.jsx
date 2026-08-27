// components/scraper/product-info.jsx
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { isValidDetail } from "@/lib/scraper-helpers";

const TRUST_BADGES = [
  { icon: "🔄", text: "۷ روز امکان بازگشت کالا" },
  { icon: "🚚", text: "ارسال اکسپرس به ایران" },
  { icon: "⏱️", text: "تضمین زمان تحویل" },
  { icon: "🛡️", text: "۱۰۰٪ اصالت کالا" },
];

export default function ProductInfo({ storeName, combinedDetails }) {
  const detailEntries = Object.entries(combinedDetails).filter(([_, value]) =>
    isValidDetail(value),
  );

  return (
    <div className="lg:col-span-6 space-y-6">
      {/* About Section */}
      <div className="space-y-4 bg-muted/20 rounded-2xl p-5 border">
        <h2 className="text-lg font-bold">درباره این محصول</h2>
        <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            ارسال مستقیم از {storeName} با تضمین اصالت کالا
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            گارانتی معتبر شرکتی و پشتیبانی ۷ روزه
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            قیمت نهایی شامل تمامی هزینه‌های گمرکی و حمل‌ونقل
          </li>
          {combinedDetails["Included Components"] && (
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              اقلام همراه: {combinedDetails["Included Components"]}
            </li>
          )}
        </ul>
      </div>

      <Separator />

      {/* Trust Badges Grid */}
      <div className="grid grid-cols-2 gap-3">
        {TRUST_BADGES.map((badge, i) => (
          <Card
            key={i}
            className="border-border/50 hover:border-primary/20 transition-colors"
          >
            <CardContent className="flex items-center gap-3">
              <span className="text-2xl shrink-0">{badge.icon}</span>
              <span className="text-sm font-semibold text-foreground leading-relaxed">
                {badge.text}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Technical Specs */}
      {detailEntries.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">مشخصات فنی کلیدی</h2>
            {detailEntries.length > 8 && (
              <span className="text-xs text-muted-foreground">
                {detailEntries.length} مورد
              </span>
            )}
          </div>
          <Card className="overflow-hidden border-border/50">
            <ScrollArea className="max-h-[400px]">
              <div className="divide-y divide-border/50">
                {detailEntries.map(([key, value], index) => (
                  <div
                    key={key}
                    className={`grid grid-cols-[140px_1fr] gap-2 p-4 text-sm transition-colors ${
                      index % 2 === 0 ? "bg-muted/30" : "bg-background"
                    }`}
                  >
                    <span className="font-medium text-muted-foreground truncate pl-2">
                      {key
                        .replace(/\n/g, " ")
                        .replace(/\u200F/g, "")
                        .trim()}
                    </span>
                    <span className="text-foreground break-words">
                      {value
                        .replace(/\n/g, " ")
                        .replace(/\u200F/g, "")
                        .trim()}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      )}
    </div>
  );
}
