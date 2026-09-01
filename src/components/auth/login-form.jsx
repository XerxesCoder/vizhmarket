"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { IconLoader2, IconCheck, IconArrowLeft } from "@tabler/icons-react";
import { sendOtp, verifyOtp } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [mode, setMode] = useState("in"); // "in" = login, "out" = register
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = phone, 2 = otp
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function submitPhone(e) {
    e.preventDefault();
    setError("");
    const cleaned = phone.replace(/\D/g, "");
    if (!/^0?9\d{9}$/.test(cleaned)) {
      setError("شماره موبایل معتبر وارد کنید");
      return;
    }
    (async () => {
      setPending(true);
      const res = await sendOtp(cleaned, mode);
      setPending(false);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setStep(2);
    })();
  }

  function submitOtp(e) {
    e.preventDefault();
    setError("");
    (async () => {
      setPending(true);
      const res = await verifyOtp(
        phone.replace(/\D/g, ""),
        otp,
        mode === "out" ? { name, phone: phone.replace(/\D/g, "") } : null
      );
      setPending(false);
      if (res?.error) {
        setError(res.error);
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    })();
  }

  return (
    <div dir="rtl" className="max-w-md mx-auto px-4 py-16">
      <Card>
        <CardContent className="p-6 flex flex-col gap-5">
          <div className="text-center">
            <h1 className="text-xl font-black">ورود به حساب کاربری</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "in" ? "کد یکبار مصرف به شماره شما پیامک می‌شود" : "ثبت نام با شماره موبایل"}
            </p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {step === 1 ? (
            <form onSubmit={submitPhone} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
                <button
                  type="button"
                  onClick={() => setMode("in")}
                  className={`py-2 rounded-lg text-sm font-medium transition-colors ${mode === "in" ? "bg-background shadow text-foreground" : "text-muted-foreground"}`}
                >
                  ورود
                </button>
                <button
                  type="button"
                  onClick={() => setMode("out")}
                  className={`py-2 rounded-lg text-sm font-medium transition-colors ${mode === "out" ? "bg-background shadow text-foreground" : "text-muted-foreground"}`}
                >
                  ثبت نام
                </button>
              </div>

              {mode === "out" && (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name">نام و نام خانوادگی</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">شماره موبایل</Label>
                <Input
                  id="phone"
                  type="tel"
                  dir="ltr"
                  inputMode="tel"
                  placeholder="09123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={pending}>
                {pending ? <IconLoader2 size={18} className="animate-spin" /> : <IconCheck size={18} />}
                {pending ? "در حال ارسال..." : "ارسال کد"}
              </Button>
            </form>
          ) : (
            <form onSubmit={submitOtp} className="flex flex-col gap-4">
              <p className="text-xs text-muted-foreground">
                کد ارسال شده به <span dir="ltr" className="font-semibold">{phone}</span> را وارد کنید:
              </p>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="otp">کد یکبار مصرف</Label>
                <Input
                  id="otp"
                  type="text"
                  dir="ltr"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="------"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={pending}>
                {pending ? <IconLoader2 size={18} className="animate-spin" /> : <IconCheck size={18} />}
                {pending ? "در حال بررسی..." : "ورود"}
              </Button>
              <Button type="button" variant="ghost" size="sm" className="w-full" onClick={() => setStep(1)}>
                <IconArrowLeft size={16} />
                تغییر شماره
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
