"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  IconShoppingCart,
  IconBolt,
  IconPackageOff,
  IconChevronLeft,
  IconCheck,
} from "@tabler/icons-react";

function formatIrr(value) {
  return new Intl.NumberFormat("fa-IR").format(Math.round(value));
}

// Splits a stored "key: value" spec entry into { key, value } for the table.
function splitSpec(entry) {
  const idx = entry.indexOf(":");
  if (idx === -1) return { key: entry.trim(), value: "" };
  return { key: entry.slice(0, idx).trim(), value: entry.slice(idx + 1).trim() };
}

export default function ProductDetail({ product }) {
  const defaultVariant =
    product.variants.find((v) => v.isDefault && v.stock > 0) ||
    product.variants.find((v) => v.stock > 0) ||
    product.variants[0] ||
    null;

  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariant?.id ?? null);
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) ?? null;

  // Gallery: variant images take priority when a variant is selected, otherwise product images
  const gallery =
    selectedVariant?.images?.length > 0
      ? selectedVariant.images
      : product.images?.length > 0
        ? product.images
        : [];
  const [activeImage, setActiveImage] = useState(0);
  const mainImage = gallery[Math.min(activeImage, gallery.length - 1)];

  // Price & stock come from the selected variant
  const irrPrice = selectedVariant ? selectedVariant.irrPrice || null : null;
  const aedPrice = selectedVariant ? selectedVariant.aedPrice : null;
  const stock = selectedVariant ? selectedVariant.stock : 0;
  const inStock = stock > 0;

  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Gallery */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.title}
                width={640}
                height={640}
                fetchPriority="high"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <IconPackageOff size={48} />
              </div>
            )}
            {product.isExpress && (
              <Badge variant="secondary" className="absolute top-4 left-4 gap-1">
                <IconBolt size={14} /> ارسال اکسپرس
              </Badge>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 h-16 w-16 rounded-xl overflow-hidden border-2 transition-colors ${
                    i === activeImage ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                  src={img}
                  alt={product.title}
                  width={64}
                  height={64}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{product.category?.name}</p>
            <h1 className="text-2xl font-black leading-9">{product.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              {product.sku && (
                <p className="text-xs text-muted-foreground" dir="ltr">SKU: {product.sku}</p>
              )}
              {(product.totalSold ?? 0) > 0 && (
                <Badge variant="secondary" className="text-[10px]">
                  {formatIrr(product.totalSold)} فروش
                </Badge>
              )}
            </div>
          </div>

          {/* Variant selector */}
          {product.variants.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">انتخاب ویژگی:</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const isSelected = v.id === selectedVariantId;
                  const disabled = v.stock <= 0;
                  const label = v.attributes.map((a) => a.value).join(" / ") || "—";
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariantId(v.id);
                        setActiveImage(0);
                      }}
                      disabled={disabled}
                      className={`relative px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed"
                      }`}
                    >
                      {label}
                      {isSelected && <IconCheck size={14} className="inline me-1 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price + stock */}
          <Card>
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div>
                {irrPrice != null ? (
                  <p className="text-2xl font-black text-primary tabular-nums">
                    {formatIrr(irrPrice)}
                    <span className="text-sm font-normal ms-1">تومان</span>
                  </p>
                ) : (
                  <p className="text-lg text-muted-foreground">
                    {product.variants.length > 0 ? "ویژگی مورد نظر را انتخاب کنید" : "برای قیمت تماس بگیرید"}
                  </p>
                )}
                {aedPrice != null && (
                  <p className="text-xs text-muted-foreground mt-1">
                    پرداخت به درهم: {aedPrice.toLocaleString("fa-IR")} AED
                  </p>
                )}
              </div>
              <Badge variant={inStock ? "secondary" : "destructive"} className="text-xs px-3 py-1.5">
                {inStock ? `${formatIrr(stock)} عدد موجود` : "ناموجود"}
              </Badge>
            </CardContent>
          </Card>

          <Button size="lg" disabled={!inStock} className="gap-2 w-full md:w-auto">
            <IconShoppingCart size={20} />
            {inStock ? "افزودن به سبد خرید" : "ناموجود"}
          </Button>

          {product.description && (
            <>
              <Separator />
              <div>
                <h2 className="font-bold mb-2">توضیحات</h2>
                <p className="text-sm leading-7 text-foreground/80 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {product.specs?.length > 0 && (
        <div className="mt-10">
          <Separator />
          <div className="mt-6">
            <h2 className="font-bold mb-4">مشخصات محصول</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2">ویژگی</TableHead>
                  <TableHead>مقدار</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.specs.map((spec, i) => {
                  const { key, value } = splitSpec(spec);
                  return (
                    <TableRow key={i}>
                      <TableCell className="text-foreground/80 font-medium">
                        {key || "—"}
                      </TableCell>
                      <TableCell>{value || "—"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

