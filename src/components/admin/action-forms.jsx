"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconTrash, IconPencil, IconAlertCircle, IconLoader2 } from "@tabler/icons-react";

// Dialog wrapper that submits a server action with FormData
export function ActionDialog({
  triggerLabel,
  triggerVariant = "outline",
  triggerSize = "sm",
  triggerIcon: TriggerIcon,
  title,
  description,
  action,
  submitLabel = "ذخیره",
  children,
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await action(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setOpen(false);
        setError(null);
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        setError(null);
      }}
    >
      <Button
        variant={triggerVariant}
        size={triggerSize}
        onClick={() => setOpen(true)}
      >
        {TriggerIcon && <TriggerIcon size={16} />}
        {triggerLabel}
      </Button>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {children}
          {error && (
            <p className="flex items-center gap-1.5 text-sm text-destructive">
              <IconAlertCircle size={16} />
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              انصراف
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <IconLoader2 size={16} className="animate-spin" />}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteActionDialog({ action, id, title = "حذف", description }) {
  return (
    <ActionDialog
      triggerLabel=""
      triggerVariant="ghost"
      triggerSize="icon-sm"
      triggerIcon={(props) => <IconTrash size={16} {...props} />}
      title={title}
      description={description}
      action={action}
      submitLabel="حذف"
    >
      <input type="hidden" name="id" value={id} />
    </ActionDialog>
  );
}

// Bulk delete: renders a destructive button + confirmation dialog that submits all selected ids
export function BulkDeleteDialog({ action, ids, label = "حذف", description, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await action(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setOpen(false);
        setError(null);
        onSuccess?.();
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        setError(null);
      }}
    >
      <Button
        variant="destructive"
        size="sm"
        disabled={ids.length === 0}
        onClick={() => setOpen(true)}
      >
        <IconTrash size={16} />
        {label} ({ids.length})
      </Button>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>حذف {ids.length} مورد</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {ids.map((id) => (
            <input key={id} type="hidden" name="ids" value={id} />
          ))}
          {error && (
            <p className="flex items-center gap-1.5 text-sm text-destructive">
              <IconAlertCircle size={16} />
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              انصراف
            </Button>
            <Button type="submit" variant="destructive" disabled={pending}>
              {pending && <IconLoader2 size={16} className="animate-spin" />}
              حذف
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditActionDialog(props) {
  return <ActionDialog {...props} triggerLabel="" triggerVariant="ghost" triggerSize="icon-sm" />;
}

export function TextField({ label, name, defaultValue, type = "text", required, placeholder, step, min }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}{required && " *"}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        step={step}
        min={min}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </div>
  );
}

export function SelectField({ label, name, defaultValue, required, options, placeholder = "انتخاب کنید" }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}{required && " *"}</Label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="h-10 rounded-2xl border border-transparent bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        {!required && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CheckboxField({ label, name, defaultChecked }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-[var(--primary)]"
      />
      {label}
    </label>
  );
}

export function TextareaField({ label, name, defaultValue, placeholder, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}{required && " *"}</Label>
      <Textarea id={name} name={name} defaultValue={defaultValue} placeholder={placeholder} required={required} />
    </div>
  );
}
