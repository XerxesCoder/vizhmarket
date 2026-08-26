// components/scraper/product-info.jsx
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { isValidDetail } from "@/lib/scraper-helpers";

export default function ProductInfo({ storeName, combinedDetails }) {
  return (
    <div className="lg:col-span-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-bold">درباره این محصول</h2>
        <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground mr-2">
          <li>• ارسال مستقیم از {storeName} با تضمین اصالت کالا</li>
          <li>• گارانتی معتبر شرکتی و پشتیبانی ۷ روزه</li>
          <li>• قیمت نهایی شامل تمامی هزینه‌های گمرکی و حمل‌ونقل می‌باشد</li>
          {combinedDetails["Included Components"] && (
            <li>• اقلام همراه: {combinedDetails["Included Components"]}</li>
          )}
        </ul>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: "🔄", text: "۷ روز امکان بازگشت کالا" },
          { icon: "🚚", text: "ارسال اکسپرس به ایران" },
          { icon: "⏱️", text: "تضمین زمان تحویل کالا" },
          { icon: "🛡️", text: "۱۰۰٪ اصالت کالا" },
        ].map((badge, i) => (
          <Card key={i}>
            <CardContent className="p-3 flex items-center gap-3">
              <span className="text-xl flex-shrink-0">{badge.icon}</span>
              <span className="text-sm font-medium text-foreground">
                {badge.text}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {Object.keys(combinedDetails).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold">مشخصات فنی کلیدی</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y max-h-96 overflow-y-auto">
                {Object.entries(combinedDetails)
                  .filter(([key, value]) => isValidDetail(value))
                  .map(([key, value], index) => (
                    <div
                      key={key}
                      className={`grid grid-cols-[140px_1fr] p-4 text-sm ${
                        index % 2 === 0 ? "bg-muted" : "bg-background"
                      }`}
                    >
                      <span className="font-medium text-muted-foreground pl-4">
                        {key.replace(/\n/g, " ").replace(/‏/g, "").trim()}
                      </span>
                      <span className="text-foreground break-words">
                        {value.replace(/\n/g, " ").replace(/‏/g, "").trim()}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
