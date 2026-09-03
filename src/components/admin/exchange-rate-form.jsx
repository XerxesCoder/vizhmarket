"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { updateExchangeRate } from "@/lib/actions/admin-actions";
export default function ExchangeRateForm({ currentRate }) {
  const [value, setValue] = useState(currentRate ?? "");
  const [recalc, setRecalc] = useState(true);
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();
  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(); fd.set("aedToIrr", value); if (recalc) fd.set("recalculate", "on");
    startTransition(async () => { const res = await updateExchangeRate(fd); if (res?.error) setError(res.error); else setError(null); });
  };
  return (
    <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
      <Input type="number" step="0.01" min="0" value={value} onChange={(e) => setValue(e.target.value)} placeholder="مثال: 20000" className="rounded-2xl" />
      <div className="rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 p-3 text-xs leading-6 text-amber-800 dark:text-amber-200">این تغییر باعث به‌روزرسانی قیمت تومانی تمام محصولاتی که قیمت درهم و موجودی دارند می‌شود (تومان = درهم × نرخ جدید).</div>
      <div className="flex items-center gap-3">
        <Switch checked={recalc} onCheckedChange={setRecalc} id="recalc" />
        <Label htmlFor="recalc" className="text-sm">به‌روزرسانی قیمت محصولات</Label>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={pending} className="rounded-2xl">{pending ? "در حال ذخیره..." : "ذخیره نرخ"}</Button>
    </form>
  );
}
