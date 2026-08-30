"use client";

import { useTransition } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteActionDialog } from "@/components/admin/action-forms";
import { updateOrderStatus, deleteOrder } from "@/lib/actions/admin-actions";

const STATUS_META = {
  SUBMITTED: { label: "ثبت‌شده", variant: "secondary" },
  PAID: { label: "پرداخت‌شده", variant: "secondary" },
  BOUGHT: { label: "خریداری‌شده", variant: "default" },
  SHIPPED_BY_STORE: { label: "تحویل به پست", variant: "default" },
  SHIPPED: { label: "ارسال‌شده", variant: "default" },
  DELIVERED: { label: "تحویل‌شده", variant: "default" },
  CANCELLED: { label: "لغو‌شده", variant: "destructive" },
};

const STATUS_ORDER = [
  "SUBMITTED",
  "PAID",
  "BOUGHT",
  "SHIPPED_BY_STORE",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

function formatIrr(value) {
  return new Intl.NumberFormat("fa-IR").format(Math.round(value ?? 0));
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

function StatusSelect({ id, current }) {
  const [pending, startTransition] = useTransition();
  const handle = (e) => {
    const formData = new FormData();
    formData.set("id", id);
    formData.set("status", e.target.value);
    startTransition(async () => {
      await updateOrderStatus(formData);
    });
  };
  return (
    <select
      defaultValue={current}
      onChange={handle}
      disabled={pending}
      className="h-8 rounded-lg border border-border bg-background px-2 text-xs outline-none focus-visible:border-ring cursor-pointer"
    >
      {STATUS_ORDER.map((s) => (
        <option key={s} value={s}>
          {STATUS_META[s].label}
        </option>
      ))}
    </select>
  );
}

export default function OrderManager({ orders }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">سفارش‌های فروشگاه ({orders.length})</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>شناسه</TableHead>
            <TableHead>مشتری</TableHead>
            <TableHead>محصولات</TableHead>
            <TableHead>مبلغ کل</TableHead>
            <TableHead>تاریخ</TableHead>
            <TableHead>وضعیت</TableHead>
            <TableHead className="text-start">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                سفارشی وجود ندارد
              </TableCell>
            </TableRow>
          )}
          {orders.map((order) => {
            const totalIrr = order.items.reduce((s, i) => s + i.unitIrrPrice, 0);
            const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);
            const meta = STATUS_META[order.status] || STATUS_META.SUBMITTED;
            return (
              <TableRow key={order.id}>
                <TableCell dir="ltr" className="text-xs text-muted-foreground">
                  {order.id.slice(-8)}
                </TableCell>
                <TableCell>
                  <div className="min-w-0">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground" dir="ltr">{order.customerPhone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 max-w-56">
                    {order.items.map((item) => (
                      <span key={item.id} className="text-xs flex items-center gap-1">
                        <span className="truncate">{item.product?.title}</span>
                        {item.variant?.attributes?.length ? (
                          <span className="text-muted-foreground">
                            ({item.variant.attributes.map((a) => a.value).join(" / ")})
                          </span>
                        ) : null}
                        <Badge variant="outline" className="px-1.5 text-[10px]">×{item.quantity}</Badge>
                      </span>
                    ))}
                    <span className="text-[10px] text-muted-foreground">{formatIrr(totalQty)} کالا</span>
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-primary whitespace-nowrap">
                  {formatIrr(totalIrr)} تومان
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 items-start">
                    <Badge variant={meta.variant}>{meta.label}</Badge>
                    <StatusSelect id={order.id} current={order.status} />
                  </div>
                </TableCell>
                <TableCell>
                  <DeleteActionDialog
                    action={deleteOrder}
                    id={order.id}
                    title="حذف سفارش"
                    description={`آیا از حذف سفارش «${order.id.slice(-8)}» مطمئن هستید؟`}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}