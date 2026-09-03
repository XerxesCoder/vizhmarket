"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ViewOrderDialog, EditStatusDialog, QuickDownload, StatusBadge, formatIrr, formatDate } from "@/components/admin/order-helpers";
import { IconArrowLeft } from "@tabler/icons-react";

function getInitials(n) { const p = (n || "").trim().split(/\s+/).filter(Boolean); if (!p.length) return "؟"; if (p.length === 1) return p[0].slice(0, 2); return (p[0][0] + p[p.length - 1][0]).toUpperCase(); }

function StoreTable({ orders }) {
  if (!orders.length) return <p className="text-sm text-muted-foreground border border-dashed rounded-2xl p-6 text-center">سفارشی ندارد</p>;
  return (
    <div className="rounded-2xl border border-border/50 overflow-hidden bg-card">
      <Table>
        <TableHeader><TableRow className="bg-muted/30"><TableHead>شناسه</TableHead><TableHead>محصولات</TableHead><TableHead>مبلغ</TableHead><TableHead>تاریخ</TableHead><TableHead>وضعیت</TableHead><TableHead>عملیات</TableHead></TableRow></TableHeader>
        <TableBody>{orders.map((o) => {
          const total = o.items.reduce((s, i) => s + i.unitIrrPrice * i.quantity, 0);
          return <TableRow key={o.id} className="hover:bg-muted/20"><TableCell className="text-xs tabular-nums">#{String(o.id).slice(0, 8)}</TableCell><TableCell><div className="flex flex-col gap-1 max-w-64">{o.items.map((it) => <span key={it.id} className="text-xs truncate">{it.product?.title} <Badge variant="outline" className="text-[10px] rounded-full">×{it.quantity}</Badge></span>)}</div></TableCell><TableCell className="font-bold text-primary tabular-nums text-sm">{formatIrr(total)} تومان</TableCell><TableCell className="text-xs tabular-nums">{formatDate(o.createdAt)}</TableCell><TableCell><StatusBadge status={o.status} /></TableCell><TableCell><div className="flex items-center gap-1"><ViewOrderDialog order={o} /><EditStatusDialog order={o} /><QuickDownload order={o} /></div></TableCell></TableRow>;
        })}</TableBody>
      </Table>
    </div>
  );
}
function WebTable({ orders }) {
  if (!orders.length) return <p className="text-sm text-muted-foreground border border-dashed rounded-2xl p-6 text-center">سفارشی ندارد</p>;
  return (
    <div className="rounded-2xl border border-border/50 overflow-hidden bg-card">
      <Table>
        <TableHeader><TableRow className="bg-muted/30"><TableHead>شناسه</TableHead><TableHead>عنوان/لینک</TableHead><TableHead>مبلغ</TableHead><TableHead>تاریخ</TableHead><TableHead>وضعیت</TableHead></TableRow></TableHeader>
        <TableBody>{orders.map((o) => (
          <TableRow key={o.id} className="hover:bg-muted/20"><TableCell className="text-xs tabular-nums">{o.id.slice(0, 8)}</TableCell><TableCell className="max-w-64 truncate text-xs"><a href={o.requestedUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">{o.requestedTitle || o.requestedUrl}</a></TableCell><TableCell className="font-bold text-primary tabular-nums text-sm">{formatIrr(o.totalIrrPrice)} تومان</TableCell><TableCell className="text-xs tabular-nums">{formatDate(o.createdAt)}</TableCell><TableCell><StatusBadge status={o.status} /></TableCell></TableRow>
        ))}</TableBody>
      </Table>
    </div>
  );
}

export default function UserOrders({ user }) {
  const storeOrders = user?.storeOrders || [];
  const webOrders = user?.webOrders || [];
  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline w-fit"><IconArrowLeft size={15} /> بازگشت به کاربران</Link>
      <div className="rounded-2xl border border-border/50 bg-card p-4 flex items-center gap-3">
        <span className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{getInitials(user?.name)}</span>
        <div><div className="font-bold">{user?.name}</div><div className="text-xs text-muted-foreground tabular-nums">{user?.phone} · {user?.email || "—"}</div></div>
        <div className="ms-auto flex gap-2"><Badge variant="secondary" className="rounded-full tabular-nums">{storeOrders.length} فروشگاه</Badge><Badge variant="outline" className="rounded-full tabular-nums">{webOrders.length} وب</Badge></div>
      </div>
      <Tabs defaultValue="store">
        <TabsList><TabsTrigger value="store">فروشگاه <Badge variant="secondary" className="ms-1 rounded-full text-[10px]">{storeOrders.length}</Badge></TabsTrigger><TabsTrigger value="web">وب <Badge variant="outline" className="ms-1 rounded-full text-[10px]">{webOrders.length}</Badge></TabsTrigger></TabsList>
        <TabsContent value="store" className="mt-4"><StoreTable orders={storeOrders} /></TabsContent>
        <TabsContent value="web" className="mt-4"><WebTable orders={webOrders} /></TabsContent>
      </Tabs>
    </div>
  );
}
