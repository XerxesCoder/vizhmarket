"use client";

import { useState, useTransition } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { IconPencil, IconPlus, IconX, IconFolderPlus, IconLoader2, IconPackage, IconPhotoOff } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ActionDialog,
  EditActionDialog,
  DeleteActionDialog,
  BulkDeleteDialog,
  TextField,
  SelectField,
  CheckboxField,
  TextareaField,
} from "@/components/admin/action-forms";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProducts,
  createVariant,
  updateVariant,
  deleteVariant,
  createCategory,
} from "@/lib/actions/admin-actions";

function Section({ title, hint, children }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-muted/20 p-4 flex flex-col gap-4">
      <div>
        <p className="text-sm font-bold">{title}</p>
        {hint && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function CategorySelector({ value, onChange, categories, setCategories }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createCategory(formData);
      if (res?.error) {
        setError(res.error);
      } else if (res?.category) {
        setCategories((prev) => [...prev, res.category]);
        onChange(res.category.id);
        setOpen(false);
        setError(null);
      }
    });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="categoryId">دسته‌بندی *</Label>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2">
        <select
          id="categoryId"
          name="categoryId"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="h-10 flex-1 rounded-2xl border border-border/50 bg-input/50 px-3 text-sm shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <Button type="button" variant="outline" size="sm" className="h-10 shrink-0 rounded-xl border-border/50 w-full sm:w-auto" onClick={() => setOpen(true)}>
          <IconFolderPlus size={16} />
          دسته جدید
        </Button>
      </div>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); setError(null); }}>
        <DialogContent className="sm:max-w-md! rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ایجاد دسته‌بندی</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField label="نام دسته‌بندی" name="name" required />
            <TextField label="اسلاگ (Slug)" name="slug" placeholder="shoes" required />
            <TextField
              label="تصویر دسته‌بندی (مسیر محلی)"
              name="image"
              placeholder="/assets/categories/shoes.jpg"
            />
            <SelectField
              label="دسته‌بندی والد"
              name="parentId"
              placeholder="بدون والد (دسته اصلی)"
              options={categories.filter((c) => c.id !== value).map((c) => ({ value: c.id, label: c.name }))}
            />
            {error && (
              <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" className="rounded-xl w-full sm:w-auto" onClick={() => setOpen(false)}>
                انصراف
              </Button>
              <Button type="submit" disabled={pending} className="rounded-xl w-full sm:w-auto">
                {pending && <IconLoader2 size={16} className="animate-spin" />}
                ایجاد
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProductFields({ product, categories, setCategories }) {
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? "");
  const [imagesText, setImagesText] = useState(product?.images?.join("\n") ?? "");
  const previews = imagesText.split("\n").map((s) => s.trim().replaceAll("\\", "/")).filter(Boolean).slice(0, 8);

  return (
    <div className="flex flex-col gap-4">
      {product && <input type="hidden" name="id" value={product.id} />}

      <Section title="اطلاعات اصلی" hint="عنوان نمایشی محصول و آدرس یکتای آن">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField label="نام محصول *" name="title" defaultValue={product?.title} required placeholder="کفش نایک ایر" />
          <div className="flex flex-col gap-1.5">
            <TextField
              label="اسلاگ (Slug) *"
              name="slug"
              defaultValue={product?.slug}
              placeholder="nike-air-max"
              required
            />
            <p className="text-[11px] text-muted-foreground">فقط حروف انگلیسی، عدد و خط تیره</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField label="برند (اختیاری)" name="brand" defaultValue={product?.brand} placeholder="Nike" />
          <TextField label="لینک فروشگاه اصلی (اختیاری)" name="url" defaultValue={product?.url} placeholder="https://www.amazon.com/dp/..." />
        </div>
      </Section>

      <Section title="تصاویر" hint="هر تصویر در یک خط، مثال: /assets/products/shoe/1.jpg یا https://...">
        <div className="flex flex-col gap-2">
          <Label htmlFor="product-images">تصاویر *</Label>
          <textarea
            id="product-images"
            name="images"
            required
            value={imagesText}
            onChange={(e) => setImagesText(e.target.value)}
            placeholder={"/assets/products/1.jpg\n/assets/products/2.jpg"}
            rows={3}
            className="min-h-20 w-full rounded-2xl border border-border/50 bg-input/50 px-3 py-2.5 text-sm shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 placeholder:text-muted-foreground/60"
          />
          {previews.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {previews.map((src, i) => (
                <div key={i} className="size-10 overflow-hidden rounded-xl border border-border/50 bg-white shadow-sm shrink-0">
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" width={40} height={40} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">پیش‌نمایش اینجا نمایش داده می‌شود</p>
          )}
        </div>
      </Section>

      <Section title="دسته‌بندی و نمایش">
        <CategorySelector value={categoryId} onChange={setCategoryId} categories={categories} setCategories={setCategories} />
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 rounded-2xl border border-border/50 bg-card px-4 py-3">
          <CheckboxField label="ارسال اکسپرس" name="isExpress" defaultChecked={product?.isExpress} />
          <Separator orientation="vertical" className="hidden sm:block h-5 self-center" />
          <CheckboxField label="فعال (نمایش در فروشگاه)" name="isActive" defaultChecked={product ? product.isActive : true} />
        </div>
      </Section>

      <Section title="مشخصات" hint="هر ردیف یک ویژگی — نام و مقدار با : ذخیره می‌شود">
        <KeyValueFields
          name="spec"
          label="مشخصات محصول"
          entries={product?.specs}
          keyPlaceholder="نام (مثل وزن)"
          valuePlaceholder="مقدار (مثل ۲.۵ کیلوگرم)"
        />
      </Section>

      <Section title="توضیحات">
        <TextareaField label="توضیحات" name="description" defaultValue={product?.description} placeholder="توضیحات کامل محصول..." />
        <p className="rounded-xl bg-muted/40 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          قیمت و موجودی از طریق ویژگی‌ها (رنگ/سایز) مدیریت می‌شود.
        </p>
      </Section>
    </div>
  );
}

function splitEntry(entry) {
  const idx = entry.indexOf(":");
  if (idx === -1) return { key: entry.trim(), value: "" };
  return { key: entry.slice(0, idx).trim(), value: entry.slice(idx + 1).trim() };
}

function KeyValueFields({ name, label, entries = [], keyPlaceholder, valuePlaceholder }) {
  const [rows, setRows] = useState(() =>
    entries.length > 0
      ? entries.map((e) => (typeof e === "string" ? splitEntry(e) : { key: e.key, value: e.value }))
      : [{ key: "", value: "" }]
  );

  const updateRow = (i, field, val) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)));

  const addRow = () => setRows((prev) => [...prev, { key: "", value: "" }]);
  const removeRow = (i) => setRows((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-2.5">
      <Label>{label}</Label>
      <div className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] items-center gap-2">
            <Input name={`${name}Key`} placeholder={keyPlaceholder} value={row.key} onValueChange={(v) => updateRow(i, "key", v)} />
            <Input name={`${name}Value`} placeholder={valuePlaceholder} value={row.value} onValueChange={(v) => updateRow(i, "value", v)} />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="حذف ردیف"
              onClick={() => removeRow(i)}
              className="size-9 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive justify-self-end sm:justify-self-auto"
            >
              <IconX size={16} />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addRow} className="self-start rounded-xl border-dashed">
        <IconPlus size={16} />
        افزودن
      </Button>
    </div>
  );
}

function VariantFields({ variant, productId, aedRate }) {
  const [attrRows, setAttrRows] = useState(() => {
    const e = variant?.attributes ?? [];
    if (e.length === 0) return [{ key: "", value: "" }];
    return e.map((a) => ({ key: a.key ?? "", value: a.value ?? "" }));
  });
  const labelPreview = attrRows.map((r) => r.value.trim()).filter(Boolean).join(" / ") || "— پیش‌نمایش برچسب —";
  const [aed, setAed] = useState(variant?.aedPrice ?? "");
  const [irr, setIrr] = useState(variant?.irrPrice ?? "");
  const onAedChange = (v) => {
    setAed(v);
    const num = parseFloat(v);
    if (aedRate && Number.isFinite(num) && num > 0) setIrr(String(Math.round(num * aedRate)));
    else if (!v || parseFloat(v) === 0) setIrr(irr);
  };

  return (
    <div className="flex flex-col gap-4">
      {variant ? <input type="hidden" name="id" value={variant.id} /> : <input type="hidden" name="productId" value={productId} />}
      <input type="hidden" name="aedPrice" value={aed || 0} />
      <input type="hidden" name="irrPrice" value={irr || 0} />

      <Section title="ویژگی‌ها" hint="مثال: رنگ / قرمز، سایز / ۴۲">
        <KeyValueFields name="attr" label="ویژگی‌ها (نام / مقدار)" entries={variant?.attributes} keyPlaceholder="نام (مثل رنگ)" valuePlaceholder="مقدار (مثل قرمز)" />
        <div className="rounded-xl bg-muted/40 px-3 py-2 text-xs">
          <span className="text-muted-foreground">پیش‌نمایش برچسب: </span>
          <span className="font-medium">{labelPreview}</span>
        </div>
      </Section>

      <Section title="تصاویر" hint="هر تصویر در یک خط">
        <TextareaField label="تصاویر ویژگی" name="images" defaultValue={variant?.images?.join("\n")} placeholder={"/assets/variants/red-1.jpg\n/assets/variants/red-2.jpg"} />
      </Section>

      <Section title="قیمت و موجودی">
        {aedRate && <p className="text-xs text-muted-foreground">نرخ درهم: {new Intl.NumberFormat("fa-IR").format(aedRate)} تومان — قیمت درهم وارد کنید تا تومان خودکار محاسبه شود</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>قیمت (درهم)</Label>
            <Input type="number" step="0.01" min="0" value={aed} onValueChange={onAedChange} placeholder="0 = بدون محاسبه" />
            <p className="text-[11px] text-muted-foreground">۰ = فقط تومان استفاده می‌شود</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>قیمت (تومان) *</Label>
            <Input type="number" min="0" value={irr} onValueChange={setIrr} required placeholder="تومان" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
          <TextField label="موجودی" name="stock" type="number" min="0" defaultValue={variant?.stock ?? 0} />
          <div className="rounded-2xl border border-border/50 bg-card px-4 py-3 flex items-center">
            <CheckboxField label="ویژگی پیش‌فرض" name="isDefault" defaultChecked={variant?.isDefault} />
          </div>
        </div>
      </Section>
    </div>
  );
}

function RowCheckbox({ checked, onChange }) {
  return (
    <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 cursor-pointer rounded accent-[var(--primary)]" />
  );
}

export default function ProductManager({ products, categories, aedRate }) {
  const [selected, setSelected] = useState([]);
  const [categoryList, setCategoryList] = useState(categories);
  const [sortQty, setSortQty] = useState(null); // null | asc | desc
  const totalQty = (p) => p.variants.reduce((s, v) => s + (v.stock || 0), 0);
  const sorted = [...products].sort((a, b) => {
    if (!sortQty) return 0;
    return sortQty === "asc" ? totalQty(a) - totalQty(b) : totalQty(b) - totalQty(a);
  });

  const toggle = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleAll = () => setSelected((prev) => (prev.length === products.length && products.length > 0 ? [] : products.map((p) => p.id)));
  const clearSelection = () => setSelected([]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold tracking-tight">محصولات</h2>
          <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-muted px-2.5 text-xs font-semibold tabular-nums">
            {products.length.toLocaleString("fa-IR")}
          </span>
          {selected.length > 0 && <span className="text-sm text-muted-foreground">{selected.length.toLocaleString("fa-IR")} انتخاب شده</span>}
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {selected.length > 0 && (
            <BulkDeleteDialog action={deleteProducts} ids={selected} label="حذف محصولات" description="محصولات انتخاب‌شده به همراه ویژگی‌هایشان حذف خواهند شد. این عمل قابل بازگشت نیست." onSuccess={clearSelection} />
          )}
          <ActionDialog
            triggerLabel="محصول جدید"
            triggerVariant="default"
            triggerIcon={IconPlus}
            title="ایجاد محصول"
            description="محصول را بسازید؛ قیمت و موجودی پس از ایجاد، از طریق ویژگی‌ها تنظیم می‌شوند."
            action={createProduct}
            submitLabel="ایجاد محصول"
            contentClassName="sm:max-w-2xl! rounded-2xl max-h-[90vh] overflow-y-auto"
          >
            <ProductFields categories={categoryList} setCategories={setCategoryList} />
          </ActionDialog>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-border/50 bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent [&_th]:py-3.5 [&_th]:text-xs [&_th]:font-semibold [&_th]:text-muted-foreground">
              <TableHead className="w-10 ps-4">
                <RowCheckbox checked={products.length > 0 && selected.length === products.length} onChange={toggleAll} />
              </TableHead>
              <TableHead>محصول</TableHead>
              <TableHead>دسته‌بندی</TableHead>
              <TableHead><button onClick={() => setSortQty((p) => (p === "desc" ? "asc" : p === "asc" ? null : "desc"))} className="flex items-center gap-1 hover:text-foreground">موجودی کل {sortQty === "desc" ? "↓" : sortQty === "asc" ? "↑" : "↕"}</button></TableHead>
              <TableHead>ویژگی‌ها</TableHead>
              <TableHead className="pe-4 text-start">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="py-16">
                  <EmptyState categoryList={categoryList} setCategoryList={setCategoryList} />
                </TableCell>
              </TableRow>
            )}
            {sorted.map((product) => (
              <TableRow key={product.id} className="group hover:bg-muted/40 transition-colors">
                <TableCell className="ps-4">
                  <RowCheckbox checked={selected.includes(product.id)} onChange={() => toggle(product.id)} />
                </TableCell>
                <TableCell>
                  <ProductCell product={product} />
                </TableCell>
                <TableCell>
                  <span className="inline-flex max-w-32 truncate rounded-full border border-border/50 bg-muted/40 px-2.5 py-1 text-xs font-medium">
                    {product.category?.name ?? "—"}
                  </span>
                </TableCell>
                <TableCell className="tabular-nums text-sm font-semibold">{product.variants.reduce((s, v) => s + (v.stock || 0), 0).toLocaleString("fa-IR")}</TableCell>
                <TableCell>
                  <VariantPills product={product} aedRate={aedRate} />
                </TableCell>
                <TableCell className="pe-4">
                  <ProductActions product={product} categoryList={categoryList} setCategoryList={setCategoryList} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="flex md:hidden flex-col gap-3">
        {products.length === 0 && (
          <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
            <EmptyState categoryList={categoryList} setCategoryList={setCategoryList} />
          </div>
        )}
        {sorted.map((product) => (
          <div key={product.id} className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <RowCheckbox checked={selected.includes(product.id)} onChange={() => toggle(product.id)} />
                <ProductCell product={product} />
              </div>
              <ProductActions product={product} categoryList={categoryList} setCategoryList={setCategoryList} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex rounded-full border border-border/50 bg-muted/40 px-2.5 py-1 text-xs font-medium">{product.category?.name ?? "—"}</span>
              <span className="text-xs tabular-nums font-semibold">موجودی کل: {product.variants.reduce((s, v) => s + (v.stock || 0), 0).toLocaleString("fa-IR")}</span>
            </div>
            <VariantPills product={product} aedRate={aedRate} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductCell({ product }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-white shadow-sm">
        {product.images[0] ? <img src={product.images[0]} alt="" className="h-full w-full object-contain p-1" width={48} height={48} /> : <IconPhotoOff size={20} className="text-muted-foreground/50" />}
      </div>
      <div className="min-w-0">
        <p className="truncate max-w-52 text-sm font-semibold leading-5">{product.title}</p>
        <p className="truncate max-w-52 text-xs tabular-nums text-muted-foreground" dir="ltr">{product.sku || product.slug}</p>
        <Badge variant={product.isActive ? "secondary" : "destructive"} className={`mt-1.5 rounded-full px-2 py-0 text-[11px] font-medium ${product.isActive ? "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:text-emerald-400" : ""}`}>
          {product.isActive ? "فعال" : "غیرفعال"}
        </Badge>
      </div>
    </div>
  );
}

function VariantPills({ product, aedRate }) {
  return (
    <div className="flex max-w-md flex-wrap gap-1.5">
      {product.variants.map((v, idx) => {
        const label = v.attributes.map((a) => a.value).join(" / ") || "—";
        return (
          <span key={v.id} className="inline-flex items-center gap-1.5 rounded-2xl border border-border/50 bg-card px-2.5 py-1.5 text-xs shadow-sm flex-wrap">
            <span className="font-medium">{label}</span>
            <Badge variant="outline" className="rounded-full px-1.5 py-0 text-[10px] tabular-nums">#{idx + 1}</Badge>
            <Badge variant={v.stock > 0 ? "secondary" : "destructive"} className={`rounded-full px-1.5 py-0 text-[10px] tabular-nums ${v.stock > 0 ? "bg-emerald-500/10 text-emerald-700 border border-emerald-200 dark:text-emerald-400" : ""}`}>
              {v.stock.toLocaleString("fa-IR")}
            </Badge>
            <span className="font-semibold tabular-nums text-primary">{v.irrPrice ? v.irrPrice.toLocaleString("fa-IR") : "—"}</span>
            <span className="flex items-center gap-0.5 ps-1">
              <EditActionDialog title="ویرایش ویژگی" triggerIcon={IconPencil} action={updateVariant} contentClassName="rounded-2xl max-h-[90vh] overflow-y-auto">
                <VariantFields variant={v} aedRate={aedRate} />
              </EditActionDialog>
              <DeleteActionDialog action={deleteVariant} id={v.id} title="حذف ویژگی" description={`آیا از حذف «${label}» مطمئن هستید؟`} />
            </span>
          </span>
        );
      })}
      <ActionDialog triggerLabel="افزودن" triggerIcon={IconPlus} triggerVariant="outline" title={`ویژگی جدید برای «${product.title}»`} action={createVariant} submitLabel="افزودن" contentClassName="rounded-2xl max-h-[90vh] overflow-y-auto">
        <VariantFields productId={product.id} aedRate={aedRate} />
      </ActionDialog>
      {product.variants.length === 0 && <span className="self-center text-xs text-muted-foreground">بدون ویژگی — موجودی ۰</span>}
    </div>
  );
}

function ProductActions({ product, categoryList, setCategoryList }) {
  return (
    <div className="flex items-center gap-1">
      <EditActionDialog title="ویرایش محصول" triggerIcon={IconPencil} action={updateProduct} contentClassName="sm:max-w-2xl! rounded-2xl max-h-[90vh] overflow-y-auto">
        <ProductFields product={product} categories={categoryList} setCategories={setCategoryList} />
      </EditActionDialog>
      <DeleteActionDialog action={deleteProduct} id={product.id} title="حذف محصول" description={`آیا از حذف «${product.title}» مطمئن هستید؟`} />
    </div>
  );
}

function EmptyState({ categoryList, setCategoryList }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-muted border border-border/50">
        <IconPackage size={28} strokeWidth={1.6} className="text-muted-foreground" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold">هنوز محصولی ثبت نشده</p>
        <p className="text-sm text-muted-foreground">اولین محصول فروشگاه را اضافه کنید</p>
      </div>
      <ActionDialog triggerLabel="افزودن محصول" triggerVariant="default" triggerIcon={IconPlus} title="ایجاد محصول" description="محصول را بسازید؛ قیمت و موجودی پس از ایجاد، از طریق ویژگی‌ها تنظیم می‌شوند." action={createProduct} submitLabel="ایجاد محصول" contentClassName="sm:max-w-2xl! rounded-2xl max-h-[90vh] overflow-y-auto">
        <ProductFields categories={categoryList} setCategories={setCategoryList} />
      </ActionDialog>
    </div>
  );
}
