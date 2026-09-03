"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DeleteActionDialog } from "@/components/admin/action-forms";
import { updateUserRole, deleteUser } from "@/lib/actions/admin-actions";
import { IconEye, IconShield, IconLoader2, IconSearch, IconUsers } from "@tabler/icons-react";

const ROLE_META = {
  USER: { label: "کاربر", variant: "secondary" },
  ADMIN: { label: "مدیر", variant: "default" },
};

const STATUS_META = {
  SUBMITTED: { label: "ثبت‌شده", variant: "secondary" },
  PAID: { label: "پرداخت‌شده", variant: "secondary" },
  SHIPPED: { label: "ارسال‌شده", variant: "default" },
  BOUGHT: { label: "خریداری‌شده", variant: "default" },
  SHIPPED_BY_STORE: { label: "تحویل به پست", variant: "default" },
  DELIVERED: { label: "تحویل‌شده", variant: "default" },
  CANCELLED: { label: "لغو‌شده", variant: "destructive" },
};

function getInitials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  if (parts.length === 1) return parts[0].slice(0, 2);
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

function formatIrr(value) {
  return new Intl.NumberFormat("fa-IR").format(Math.round(value ?? 0));
}

function RoleDialog({ user }) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(user.role);
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("id", user.id);
    formData.set("role", role);
    startTransition(async () => {
      const res = await updateUserRole(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setOpen(false);
        setError(null);
      }
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon-sm"
        aria-label={`تغییر نقش ${user.name}`}
        onClick={() => {
          setRole(user.role);
          setOpen(true);
        }}
      >
        <IconShield size={16} />
      </Button>
      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          setError(null);
        }}
      >
        <DialogContent className="sm:max-w-md!">
          <DialogHeader>
            <DialogTitle>تغییر نقش</DialogTitle>
            <DialogDescription>
              نقش «{user.name}»؟ (تلفن: {user.phone})
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm font-medium">
                <IconShield size={15} />
                نقش
              </div>
              <select
                id={`role-${user.id}`}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-10 rounded-2xl border border-transparent bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
              >
                <option value="USER">کاربر</option>
                <option value="ADMIN">مدیر</option>
              </select>
            </div>
            {error && (
              <p className="flex items-center gap-1.5 text-sm text-destructive">
                {error}
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                انصراف
              </Button>
              <Button type="submit" disabled={pending}>
                {pending && <IconLoader2 size={16} className="animate-spin" />}
                ذخیره
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}



export default function UserManager({ users }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.phone?.includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="size-9 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
            <IconUsers size={18} className="text-primary" />
          </span>
          <div className="flex flex-col">
            <h2 className="font-bold text-base leading-none">کاربران</h2>
            <span className="text-xs text-muted-foreground tabular-nums mt-1">{filtered.length} کاربر {query && `از ${users.length}`}</span>
          </div>
          <Badge variant="secondary" className="rounded-full tabular-nums">{users.length}</Badge>
        </div>
        <div className="relative w-full sm:w-72">
          <IconSearch size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="جستجو نام، تلفن، ایمیل…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pe-3 ps-9 rounded-2xl bg-muted/50 border-border/50"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>کاربر</TableHead>
              <TableHead>تلفن</TableHead>
              <TableHead>ایمیل</TableHead>
              <TableHead>تاریخ عضویت</TableHead>
              <TableHead>نقش</TableHead>
              <TableHead>سفارش‌ها</TableHead>
              <TableHead className="text-start">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                  {query ? "نتیجه‌ای یافت نشد" : "کاربری وجود ندارد"}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <span className="size-8 rounded-full bg-primary/10 border border-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {getInitials(user.name)}
                    </span>
                    <span className="font-medium text-sm">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm tabular-nums">{user.phone}</TableCell>
                <TableCell className="text-xs text-muted-foreground tabular-nums max-w-[160px] truncate">
                  {user.email || "—"}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={ROLE_META[user.role]?.variant || "secondary"}
                    className={
                      user.role === "ADMIN"
                        ? "rounded-full"
                        : "rounded-full bg-muted text-muted-foreground border border-border/50"
                    }
                  >
                    {ROLE_META[user.role]?.label || user.role}
                  </Badge>
                </TableCell>
                <TableCell><Badge variant="secondary" className="rounded-full tabular-nums">{(user.storeOrders?.length || 0) + (user.webOrders?.length || 0)}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" aria-label={`مشاهده ${user.name}`} render={<Link href={`/admin/users/${user.id}`} />}>
                      <IconEye size={16} />
                    </Button>
                    <RoleDialog user={user} />
                    <DeleteActionDialog action={deleteUser} id={user.id} title="حذف کاربر" description={`آیا از حذف کاربر «${user.name}» مطمئن هستید؟`} />
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
