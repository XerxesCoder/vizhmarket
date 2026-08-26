// components/scraper/search-form.jsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { IconSearch } from "@tabler/icons-react";

export default function SearchForm({
  inputValue,
  setInputValue,
  onSubmit,
  isLoading,
}) {
  return (
    <section className="w-full mx-auto h-96  flex justify-center items-center">
      <Card className={"w-full max-w-4xl"}>
        <CardContent>
          <div className="mb-4 text-center">
            <h2 className="text-xl font-bold">استخراج و سفارش محصول</h2>
            <p className="text-sm text-muted-foreground mt-1">
              لینک محصول را از آمازون امارات، شئین یا نون وارد کنید
            </p>
          </div>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <Input
              type="url"
              placeholder="https://www.amazon.ae/... "
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
              dir="ltr"
              className="flex-1 h-12 font-mono text-sm"
            />
            <Button
              type="submit"
              disabled={isLoading || !inputValue}
              className="h-12 px-8 gap-2"
            >
              <IconSearch size={20} />
              <span>استخراج اطلاعات</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
