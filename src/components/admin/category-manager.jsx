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
import { IconPencil, IconPlus } from "@tabler/icons-react";
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="font-bold text-lg">دسته‌بندی‌ها ({categories.length})</h2>
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
            action={createCategory}
            submitLabel="ایجاد"
          >
            <CategoryFields categories={categories} />
          </ActionDialog>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <input
                type="checkbox"
                checked={categories.length > 0 && selected.length === categories.length}
                onChange={toggleAll}
                className="h-4 w-4 cursor-pointer accent-[var(--primary)]"
              />
            </TableHead>
            <TableHead>نام</TableHead>
            <TableHead>شناسه (Slug)</TableHead>
            <TableHead>والد</TableHead>
            <TableHead>تعداد محصول</TableHead>
            <TableHead className="text-start">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                دسته‌بندی‌ای وجود ندارد
              </TableCell>
            </TableRow>
          )}
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selected.includes(category.id)}
                  onChange={() => toggle(category.id)}
                  className="h-4 w-4 cursor-pointer accent-[var(--primary)]"
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {category.image ? (
                    <img src={category.image} alt="" className="h-8 w-8 rounded-lg object-cover bg-muted" />
                  ) : (
                    <span className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-sm">🛒</span>
                  )}
                  <span className="font-medium">{category.name}</span>
                </div>
              </TableCell>
              <TableCell dir="ltr" className="text-muted-foreground">{category.slug}</TableCell>
              <TableCell>
                {category.parentId ? (
                  <Badge variant="outline">
                    {categories.find((c) => c.id === category.parentId)?.name || "—"}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-xs">—</span>
                )}
              </TableCell>
              <TableCell>{category._count?.products ?? 0}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <EditActionDialog title="ویرایش دسته‌بندی" triggerIcon={IconPencil} action={updateCategory}>
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
  );
}
