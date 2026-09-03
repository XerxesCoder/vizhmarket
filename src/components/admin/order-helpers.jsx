"use client";
import { useRef, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { updateOrderStatus } from "@/lib/actions/admin-actions";
import { IconEye, IconPackage, IconPrinter, IconPencil, IconTruck, IconDownload } from "@tabler/icons-react";

const SITE_URL = "https://vizhmarket.ir";
const SHOP_ADDRESS = "تهران، خیابان نمونه، پلاک ۱۲۳ — vizhmarket.ir";
export const STATUS_META = {
  SUBMITTED: { label: "ثبت‌شده", className: "bg-amber-100 text-amber-800 border-amber-200" },
  PAID: { label: "پرداخت‌شده", className: "bg-sky-100 text-sky-800 border-sky-200" },
  BOUGHT: { label: "خریداری‌شده", className: "bg-violet-100 text-violet-800 border-violet-200" },
  SHIPPED_BY_STORE: { label: "تحویل به پست", className: "bg-blue-100 text-blue-800 border-blue-200" },
  SHIPPED: { label: "ارسال‌شده", className: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  DELIVERED: { label: "تحویل‌شده", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  CANCELLED: { label: "لغو‌شده", className: "bg-red-100 text-red-800 border-red-200" },
};
export const STATUS_ORDER = Object.keys(STATUS_META);
export function formatIrr(v) { return new Intl.NumberFormat("fa-IR").format(Math.round(v ?? 0)); }
export function formatDate(d) { return new Date(d).toLocaleDateString("fa-IR", { year: "numeric", month: "numeric", day: "numeric" }); }
function formatDateTime(d) { return new Date(d).toLocaleString("fa-IR", { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }); }
export function StatusBadge({ status }) { const m = STATUS_META[status] || STATUS_META.SUBMITTED; return <Badge variant="outline" className={`rounded-full border text-xs ${m.className}`}>{m.label}</Badge>; }
export function customerOf(order) { return { name: order.user?.name || "کاربر حذف‌شده", phone: order.user?.phone || "—" }; }
async function downloadPng(ref, filename) {
  const el = ref.current; if (!el) return;
  const { default: html2canvas } = await import("html2canvas-pro");
  const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
  const a = document.createElement("a"); a.href = canvas.toDataURL("image/png"); a.download = filename; a.click();
}
export function InvoiceCard({ order, innerRef }) {
  const customer = customerOf(order);
  const total = order.items.reduce((s, i) => s + i.unitIrrPrice * i.quantity, 0);
  const qty = order.items.reduce((s, i) => s + i.quantity, 0);
  return (
    <div ref={innerRef} style={{ width: "148mm", minHeight: "210mm", background: "#fff", color: "#111", padding: "12mm" }} dir="rtl">
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #111", paddingBottom: 12, marginBottom: 16 }}>
        <div><div style={{ fontWeight: 900, fontSize: 20, color: "#7c3aed" }}>ویژ مارکت</div><div style={{ fontSize: 10, color: "#666" }}>{SITE_URL}</div></div>
        <div style={{ textAlign: "left", fontSize: 11 }}><div>فاکتور #{String(order.id).slice(0, 8)}</div><div style={{ color: "#666" }}>{formatDateTime(order.createdAt)}</div></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16, fontSize: 11 }}>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 10 }}><div style={{ fontWeight: 700 }}>خریدار</div><div>{customer.name}</div><div>{customer.phone}</div><div style={{ marginTop: 6, color: "#444" }}>{order.shippingAddress}</div></div>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 10 }}><div style={{ fontWeight: 700 }}>فروشنده</div><div>ویژ مارکت</div><div style={{ color: "#444" }}>{SHOP_ADDRESS}</div></div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}><thead><tr style={{ background: "#f3f4f6" }}><th style={{ padding: 6, border: "1px solid #e5e7eb" }}>محصول</th><th style={{ padding: 6, border: "1px solid #e5e7eb" }}>تعداد</th><th style={{ padding: 6, border: "1px solid #e5e7eb" }}>فی</th><th style={{ padding: 6, border: "1px solid #e5e7eb" }}>جمع</th></tr></thead><tbody>{order.items.map((it) => <tr key={it.id}><td style={{ padding: 6, border: "1px solid #e5e7eb" }}>{it.product?.title}</td><td style={{ padding: 6, border: "1px solid #e5e7eb", textAlign: "center" }}>{formatIrr(it.quantity)}</td><td style={{ padding: 6, border: "1px solid #e5e7eb", textAlign: "center" }}>{formatIrr(it.unitIrrPrice)}</td><td style={{ padding: 6, border: "1px solid #e5e7eb", textAlign: "center" }}>{formatIrr(it.unitIrrPrice * it.quantity)}</td></tr>)}<tr style={{ fontWeight: 700, background: "#f9fafb" }}><td style={{ padding: 6, border: "1px solid #e5e7eb" }}>جمع کل</td><td style={{ padding: 6, border: "1px solid #e5e7eb", textAlign: "center" }}>{formatIrr(qty)}</td><td style={{ padding: 6, border: "1px solid #e5e7eb" }}></td><td style={{ padding: 6, border: "1px solid #e5e7eb", textAlign: "center" }}>{formatIrr(total)} تومان</td></tr></tbody></table>
    </div>
  );
}
function ShippingLabelCard({ order, innerRef }) {
  const c = customerOf(order);
  return <div ref={innerRef} style={{ width: "148mm", minHeight: "100mm", background: "#fff", color: "#111", padding: "10mm", border: "2px dashed #111" }} dir="rtl"><div style={{ fontWeight: 900, textAlign: "center", borderBottom: "2px solid #111", paddingBottom: 8, marginBottom: 12 }}>برچسب پستی — ویژ مارکت</div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12 }}><div style={{ border: "1px solid #111", borderRadius: 8, padding: 12 }}><div style={{ fontWeight: 700 }}>فرستنده</div><div>ویژ مارکت</div><div>{SHOP_ADDRESS}</div></div><div style={{ border: "1px solid #111", borderRadius: 8, padding: 12 }}><div style={{ fontWeight: 700 }}>گیرنده</div><div>{c.name}</div><div>{c.phone}</div><div>{order.shippingAddress}</div></div></div></div>;
}
export function EditStatusDialog({ order }) {
  const [open, setOpen] = useState(false); const [value, setValue] = useState(order.status); const [pending, startTransition] = useTransition();
  const save = () => { const fd = new FormData(); fd.set("id", order.id); fd.set("status", value); startTransition(async () => { await updateOrderStatus(fd); setOpen(false); }); };
  return <><Button variant="ghost" size="icon-sm" className="size-8 rounded-xl" onClick={() => setOpen(true)}><IconPencil size={16} /></Button><Dialog open={open} onOpenChange={setOpen}><DialogContent className="sm:max-w-sm rounded-2xl"><DialogHeader><DialogTitle>تغییر وضعیت</DialogTitle></DialogHeader><select value={value} onChange={(e) => setValue(e.target.value)} className="h-10 w-full rounded-xl border px-3 text-sm">{STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}</select><DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>انصراف</Button><Button disabled={pending} onClick={save}>ذخیره</Button></DialogFooter></DialogContent></Dialog></>;
}
export function ViewOrderDialog({ order }) {
  const [open, setOpen] = useState(false); const invoiceRef = useRef(null); const labelRef = useRef(null);
  return <><Button variant="ghost" size="icon-sm" className="size-8 rounded-xl" onClick={() => setOpen(true)}><IconEye size={16} /></Button><Dialog open={open} onOpenChange={setOpen}><DialogContent className="sm:max-w-3xl! max-h-[90vh] overflow-y-auto rounded-2xl"><DialogHeader><DialogTitle className="flex gap-2 items-center"><span className="size-8 rounded-xl bg-primary/10 flex items-center justify-center"><IconPackage size={16} className="text-primary" /></span>سفارش #{String(order.id).slice(0, 8)}</DialogTitle><DialogDescription>{formatDateTime(order.createdAt)}</DialogDescription></DialogHeader><div className="flex gap-2"><Button variant="outline" size="sm" className="rounded-xl gap-1.5" onClick={() => downloadPng(invoiceRef, `invoice-${order.id}.png`)}><IconDownload size={16} />دانلود فاکتور</Button><Button variant="outline" size="sm" className="rounded-xl gap-1.5" onClick={() => downloadPng(labelRef, `shipping-${order.id}.png`)}><IconTruck size={16} />برچسب پستی</Button></div><div className="rounded-2xl border p-3 bg-muted/20 text-sm">{order.shippingAddress}</div><div className="rounded-2xl border overflow-hidden"><Table><TableHeader><TableRow className="bg-muted/30"><TableHead>محصول</TableHead><TableHead>تعداد</TableHead><TableHead>فی</TableHead><TableHead>جمع</TableHead></TableRow></TableHeader><TableBody>{order.items.map((it) => <TableRow key={it.id}><TableCell>{it.product?.title}</TableCell><TableCell>{formatIrr(it.quantity)}</TableCell><TableCell>{formatIrr(it.unitIrrPrice)}</TableCell><TableCell>{formatIrr(it.unitIrrPrice * it.quantity)}</TableCell></TableRow>)}</TableBody></Table></div><div className="fixed -left-[9999px] top-0"><InvoiceCard order={order} innerRef={invoiceRef} /><ShippingLabelCard order={order} innerRef={labelRef} /></div><DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>بستن</Button></DialogFooter></DialogContent></Dialog></>;
}
export function QuickDownload({ order }) {
  const ref = useRef(null); return <><Button variant="ghost" size="icon-sm" className="size-8 rounded-xl" onClick={() => downloadPng(ref, `invoice-${order.id}.png`)}><IconPrinter size={16} /></Button><div className="fixed -left-[9999px] top-0"><InvoiceCard order={order} innerRef={ref} /></div></>;
}
