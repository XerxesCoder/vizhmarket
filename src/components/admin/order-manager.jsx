"use client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteActionDialog } from "@/components/admin/action-forms";
import { ViewOrderDialog, EditStatusDialog, QuickDownload, StatusBadge, formatIrr, formatDate, customerOf } from "@/components/admin/order-helpers";
import { deleteOrder } from "@/lib/actions/admin-actions";
import { IconShoppingBag } from "@tabler/icons-react";

export default function OrderManager({ orders }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3"><h2 className="text-xl font-bold">سفارش‌های فروشگاه</h2><Badge variant="secondary" className="rounded-full tabular-nums">{orders.length}</Badge></div>
      <div className="overflow-x-auto rounded-2xl border border-border/50 bg-card shadow-sm">
        <Table>
          <TableHeader><TableRow className="bg-muted/30"><TableHead>شناسه</TableHead><TableHead>نام</TableHead><TableHead>شماره</TableHead><TableHead>محصولات</TableHead><TableHead>مبلغ کل</TableHead><TableHead>تاریخ</TableHead><TableHead>وضعیت</TableHead><TableHead>عملیات</TableHead></TableRow></TableHeader>
          <TableBody>
            {orders.length === 0 && <TableRow><TableCell colSpan={8} className="py-16 text-center"><div className="flex flex-col items-center gap-3"><span className="flex size-14 items-center justify-center rounded-2xl bg-muted border"><IconShoppingBag size={26} className="text-muted-foreground" /></span><p className="text-sm font-medium">هنوز سفارشی ثبت نشده</p></div></TableCell></TableRow>}
            {orders.map((order) => {
              const total = order.items.reduce((s, i) => s + i.unitIrrPrice * i.quantity, 0);
              const customer = customerOf(order);
              return (
                <TableRow key={order.id} className="hover:bg-muted/20">
                  <TableCell className="tabular-nums text-xs">#{String(order.id).slice(0, 8)}</TableCell>
                  <TableCell className="text-sm font-medium">{customer.name}</TableCell>
                  <TableCell className="tabular-nums text-sm">{customer.phone}</TableCell>
                  <TableCell><div className="flex flex-col gap-1 max-w-56">{order.items.map((it) => (<span key={it.id} className="text-xs truncate">{it.product?.title} <Badge variant="outline" className="text-[10px] rounded-full">×{it.quantity}</Badge></span>))}</div></TableCell>
                  <TableCell className="font-bold text-primary tabular-nums text-sm">{formatIrr(total)} تومان</TableCell>
                  <TableCell className="text-xs tabular-nums">{formatDate(order.createdAt)}</TableCell>
                  <TableCell><StatusBadge status={order.status} /></TableCell>
                  <TableCell><div className="flex items-center gap-1"><ViewOrderDialog order={order} /><EditStatusDialog order={order} /><QuickDownload order={order} /><DeleteActionDialog action={deleteOrder} id={order.id} title="حذف سفارش" description={`حذف سفارش #${order.id}؟`} /></div></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


