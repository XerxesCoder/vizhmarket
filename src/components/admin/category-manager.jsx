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
import { IconPencil, IconPlus, IconCategory, IconFolder } from "@tabler/icons-react";
import {
  ActionDialog,
  EditActionDialog,
  DeleteActionDialog,
  BulkDeleteDialog,
  TextField,
  SelectField,
} from "@/components/admin/action-forms";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategories,
} from "@/lib/actions/admin-actions";

function CategoryFields({ category, categories }) {
  const parentOptions = categories
    .filter((c) => c.id !== category?.id)
    .map((c) => ({ value: c.id, label: c.name }));

  return (
    <>
      {category && <input type="hidden" name="id" value={category.id} />}
      <TextField label="نام دسته‌بندی" name="name" defaultValue={category?.name} required />
      <TextField
        label="اسلاگ (Slug)"
        name="slug"
        defaultValue={category?.slug}
        placeholder="shoes"
        required
      />
      <TextField
        label="تصویر دسته‌بندی (مسیر محلی)"
        name="image"
        defaultValue={category?.image}
        placeholder="/assets/categories/shoes.jpg"
      />
      <SelectField
        label="دسته‌بندی والد"
        name="parentId"
        defaultValue={category?.parentId}
        placeholder="بدون والد (دسته اصلی)"
        options={parentOptions}
      />
    </>
  );
}

export default function CategoryManager({ categories }) {
  const [selected, setSelected] = useState([]);

  const toggle = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleAll = () =>
    setSelected((prev) =>
      prev.length === categories.length && categories.length > 0 ? [] : categories.map((c) => c.id)
    );
  const clearSelection = () => setSelected([]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight">دسته‌بندی‌ها</h2>
          <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs tabular-nums">
            {categories.length}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <BulkDeleteDialog
            action={deleteCategories}
            ids={selected}
            label="حذف دسته‌بندی‌ها"
            description="دسته‌بندی‌های دارای محصول قابل حذف نیستند."
            onSuccess={clearSelection}
          />
          <ActionDialog
            triggerLabel="دسته‌بندی جدید"
            triggerVariant="default"
            triggerIcon={IconPlus}
            title="ایجاد دسته‌بندی"
            description="یک دسته‌بندی جدید برای نمایش در فروشگاه بسازید."
            action={createCategory}
            submitLabel="ایجاد"
            contentClassName="sm:max-w-md!"
          >
            <CategoryFields categories={categories} />
          </ActionDialog>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
              <TableHead className="w-10 py-3">
                <input
                  type="checkbox"
                  checked={categories.length > 0 && selected.length === categories.length}
                  onChange={toggleAll}
                  aria-label="انتخاب همه"
                  className="h-4 w-4 cursor-pointer accent-[var(--primary)] rounded"
                />
              </TableHead>
              <TableHead className="py-3 text-xs font-semibold text-muted-foreground">نام</TableHead>
              <TableHead className="py-3 text-xs font-semibold text-muted-foreground">شناسه (Slug)</TableHead>
              <TableHead className="py-3 text-xs font-semibold text-muted-foreground">والد</TableHead>
              <TableHead className="py-3 text-xs font-semibold text-muted-foreground">تعداد محصول</TableHead>
              <TableHead className="py-3 text-start text-xs font-semibold text-muted-foreground">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-16">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <span className="flex size-14 items-center justify-center rounded-2xl bg-muted border border-border/50">
                      <IconCategory size={26} className="text-muted-foreground" stroke={1.6} />
                    </span>
                    <p className="text-sm font-medium">هنوز دسته‌بندی‌ای وجود ندارد</p>
                    <p className="text-xs text-muted-foreground">اولین دسته‌بندی فروشگاه را بسازید</p>
                    <ActionDialog
                      triggerLabel="دسته‌بندی جدید"
                      triggerVariant="default"
                      triggerIcon={IconPlus}
                      title="ایجاد دسته‌بندی"
                      description="یک دسته‌بندی جدید برای نمایش در فروشگاه بسازید."
                      action={createCategory}
                      submitLabel="ایجاد"
                      contentClassName="sm:max-w-md!"
                    >
                      <CategoryFields categories={categories} />
                    </ActionDialog>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {categories.map((category) => (
              <TableRow key={category.id} className="hover:bg-muted/20 transition-colors">
                <TableCell className="py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(category.id)}
                    onChange={() => toggle(category.id)}
                    aria-label={`انتخاب ${category.name}`}
                    className="h-4 w-4 cursor-pointer accent-[var(--primary)] rounded"
                  />
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    {category.image ? (
                      <img src={category.image} alt="" className="size-10 rounded-xl object-contain bg-muted border border-border/50 shrink-0" />
                    ) : (
                      <span className="size-10 rounded-xl bg-muted border border-border/50 flex items-center justify-center shrink-0">
                        <IconFolder size={18} className="text-muted-foreground" />
                      </span>
                    )}
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-sm text-muted-foreground tabular-nums">{category.slug}</TableCell>
                <TableCell className="py-3">
                  {category.parentId ? (
                    <Badge variant="secondary" className="rounded-full text-xs font-normal">
                      {categories.find((c) => c.id === category.parentId)?.name || "—"}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant="outline" className="rounded-full tabular-nums font-medium">
                    {category._count?.products ?? 0}
                  </Badge>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-1">
                    <EditActionDialog
                      title="ویرایش دسته‌بندی"
                      triggerIcon={IconPencil}
                      action={updateCategory}
                      contentClassName="sm:max-w-md!"
                    >
                      <CategoryFields category={category} categories={categories} />
                    </EditActionDialog>
                    <DeleteActionDialog
                      action={deleteCategory}
                      id={category.id}
                      title="حذف دسته‌بندی"
                      description={`آیا از حذف «${category.name}» مطمئن هستید؟`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
