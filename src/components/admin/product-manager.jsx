"use client";

import { useState } from "react";
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
import { IconPencil, IconPlus, IconX } from "@tabler/icons-react";
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
} from "@/lib/actions/admin-actions";

function ProductFields({ product, categories }) {
  return (
    <>
      {product && <input type="hidden" name="id" value={product.id} />}
      <TextField label="نام محصول" name="title" defaultValue={product?.title} required />
      <TextField
        label="اسلاگ (Slug)"
        name="slug"
        defaultValue={product?.slug}
        placeholder="nike-air-max"
        required
      />
      <TextareaField
        label="تصاویر (هر مسیر در یک خط)"
        name="images"
        defaultValue={product?.images?.join("\n")}
        placeholder={"/assets/products/1.jpg\n/assets/products/2.jpg"}
        required
      />
      <SelectField
        label="دسته‌بندی"
        name="categoryId"
        defaultValue={product?.categoryId}
        required
        options={categories.map((c) => ({ value: c.id, label: c.name }))}
      />
      <CheckboxField label="ارسال اکسپرس" name="isExpress" defaultChecked={product?.isExpress} />
      <CheckboxField
        label="فعال (نمایش در فروشگاه)"
        name="isActive"
        defaultChecked={product ? product.isActive : true}
      />
      <KeyValueFields
        name="spec"
        label="مشخصات محصول (نام / مقدار)"
        entries={product?.specs}
        keyPlaceholder="نام (مثل وزن)"
        valuePlaceholder="مقدار (مثل ۲.۵ کیلوگرم)"
      />
      <TextareaField label="توضیحات" name="description" defaultValue={product?.description} />
      <p className="text-xs text-muted-foreground">
        قیمت و موجودی از طریق ویژگی‌ها (رنگ/سایز) مدیریت می‌شود.
      </p>
    </>
  );
}

// Splits a stored "key: value" string into { key, value } for editing.
function splitEntry(entry) {
  const idx = entry.indexOf(":");
  if (idx === -1) return { key: entry.trim(), value: "" };
  return { key: entry.slice(0, idx).trim(), value: entry.slice(idx + 1).trim() };
}

// Dynamic list of key/value pairs — each row is a key input + a value input,
// with add/remove so the user can include as many (or as few) as they want.
// `name` is the field prefix: it renders `<name>Key` / `<name>Value` inputs.
// `entries` may be objects ({key, value}) or "key: value" strings (parsed above).
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
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {rows.map((row, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_1fr_auto] items-center gap-2"
        >
          <Input
            name={`${name}Key`}
            placeholder={keyPlaceholder}
            value={row.key}
            onValueChange={(v) => updateRow(i, "key", v)}
          />
          <Input
            name={`${name}Value`}
            placeholder={valuePlaceholder}
            value={row.value}
            onValueChange={(v) => updateRow(i, "value", v)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="حذف ردیف"
            onClick={() => removeRow(i)}
          >
            <IconX size={16} />
          </Button>
        </div>
      ))}
      <div>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <IconPlus size={16} />
          افزودن
        </Button>
      </div>
    </div>
  );
}

// Explicit props: pass `variant` for edit, or `productId` for create
function VariantFields({ variant, productId }) {
  return (
    <>
      {variant ? (
        <input type="hidden" name="id" value={variant.id} />
      ) : (
        <input type="hidden" name="productId" value={productId} />
      )}
      <KeyValueFields
        name="attr"
        label="ویژگی‌ها (نام / مقدار)"
        entries={variant?.attributes}
        keyPlaceholder="نام (مثل رنگ)"
        valuePlaceholder="مقدار (مثل قرمز)"
      />
      <TextareaField
        label="تصاویر ویژگی (هر مسیر در یک خط)"
        name="images"
        defaultValue={variant?.images?.join("\n")}
        placeholder={"/assets/variants/red-1.jpg\n/assets/variants/red-2.jpg"}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField label="قیمت (درهم)" name="aedPrice" type="number" step="0.01" min="0" defaultValue={variant?.aedPrice} required />
        <TextField label="قیمت (تومان)" name="irrPrice" type="number" min="0" defaultValue={variant?.irrPrice} required />
        <TextField label="موجودی" name="stock" type="number" min="0" defaultValue={variant?.stock} />
      </div>
      <CheckboxField label="ویژگی پیش‌فرض" name="isDefault" defaultChecked={variant?.isDefault} />
    </>
  );
}

function RowCheckbox({ checked, onChange }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 cursor-pointer accent-[var(--primary)]"
    />
  );
}

export default function ProductManager({ products, categories }) {
  const [selected, setSelected] = useState([]);

  const toggle = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleAll = () =>
    setSelected((prev) =>
      prev.length === products.length && products.length > 0 ? [] : products.map((p) => p.id)
    );
  const clearSelection = () => setSelected([]);

  const totalStock = (product) =>
    product.variants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="font-bold text-lg">محصولات ({products.length})</h2>
        <div className="flex items-center gap-2">
          <BulkDeleteDialog
            action={deleteProducts}
            ids={selected}
            label="حذف محصولات"
            description="محصولات انتخاب‌شده به همراه ویژگی‌هایشان حذف خواهند شد. این عمل قابل بازگشت نیست."
            onSuccess={clearSelection}
          />
          <ActionDialog
            triggerLabel="محصول جدید"
            triggerVariant="default"
            triggerIcon={IconPlus}
            title="ایجاد محصول"
            action={createProduct}
            submitLabel="ایجاد محصول"
          >
            <ProductFields categories={categories} />
          </ActionDialog>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <RowCheckbox
                checked={products.length > 0 && selected.length === products.length}
                onChange={toggleAll}
              />
            </TableHead>
            <TableHead>محصول</TableHead>
            <TableHead>دسته‌بندی</TableHead>
            <TableHead>ویژگی‌ها (موجودی / قیمت)</TableHead>
            <TableHead className="text-start">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                محصولی وجود ندارد
              </TableCell>
            </TableRow>
          )}
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <RowCheckbox checked={selected.includes(product.id)} onChange={() => toggle(product.id)} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img src={product.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover bg-muted" />
                  <div className="min-w-0">
                    <p className="font-medium truncate max-w-48">{product.title}</p>
                    <p className="text-xs text-muted-foreground" dir="ltr">{product.sku || product.slug}</p>
                    <Badge variant={product.isActive ? "secondary" : "destructive"} className="mt-1 px-1.5 py-0 text-[10px]">
                      {product.isActive ? "فعال" : "غیرفعال"}
                    </Badge>
                  </div>
                </div>
              </TableCell>
              <TableCell>{product.category?.name}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {product.variants.map((v) => {
                    const label = v.attributes.map((a) => a.value).join(" / ") || "—";
                    return (
                    <span key={v.id} className="inline-flex items-center gap-1.5 border rounded-md px-1.5 py-1 text-xs">
                      <span className="font-medium">{label}</span>
                      {v.sku && (
                        <span className="text-[10px] text-muted-foreground leading-none" dir="ltr">
                          {v.sku}
                        </span>
                      )}
                      <Badge variant={v.stock > 0 ? "secondary" : "destructive"} className="px-1 py-0 text-[10px]">
                        {v.stock}
                      </Badge>
                      <span className="text-primary font-semibold">
                        {v.irrPrice ? v.irrPrice.toLocaleString("fa-IR") : "—"}
                      </span>
                      <EditActionDialog
                        title="ویرایش ویژگی"
                        triggerIcon={IconPencil}
                        action={updateVariant}
                      >
                        <VariantFields variant={v} />
                      </EditActionDialog>
                      <DeleteActionDialog
                        action={deleteVariant}
                        id={v.id}
                        title="حذف ویژگی"
                        description={`آیا از حذف «${label}» مطمئن هستید؟`}
                      />
                    </span>
                    );
                  })}
                  <ActionDialog
                    triggerLabel="افزودن"
                    triggerIcon={IconPlus}
                    title={`ویژگی جدید برای «${product.title}»`}
                    action={createVariant}
                    submitLabel="افزودن"
                  >
                    <VariantFields productId={product.id} />
                  </ActionDialog>
                  {product.variants.length === 0 && (
                    <span className="text-xs text-muted-foreground self-center">
                      ویژگی‌ای ندارد — موجودی کل: ۰
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <EditActionDialog title="ویرایش محصول" triggerIcon={IconPencil} action={updateProduct}>
                    <ProductFields product={product} categories={categories} />
                  </EditActionDialog>
                  <DeleteActionDialog
                    action={deleteProduct}
                    id={product.id}
                    title="حذف محصول"
                    description={`آیا از حذف «${product.title}» مطمئن هستید؟`}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

