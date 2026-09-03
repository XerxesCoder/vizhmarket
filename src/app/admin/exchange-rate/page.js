import { getExchangeRate } from "@/lib/data/admin-store";
import ExchangeRateForm from "@/components/admin/exchange-rate-form";
export const metadata = { title: "نرخ درهم | ویژ مارکت" };
export default async function ExchangeRatePage() {
  const rate = await getExchangeRate();
  return (
    <div className="max-w-md">
      <h1 className="text-xl font-bold">نرخ درهم به تومان</h1>
      <p className="text-sm text-muted-foreground mt-1">نرخ فعلی: {rate ? new Intl.NumberFormat("fa-IR").format(rate) : "—"}</p>
      <ExchangeRateForm currentRate={rate} />
    </div>
  );
}
