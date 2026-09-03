"use client";
import { useMemo, useState } from "react";
import { SectionProductCard } from "@/components/store/section-product-card";
import { IconSortDescending, IconFilter, IconPackageOff } from "@tabler/icons-react";

const SORTS = [
  { value: "newest", label: "جدیدترین" },
  { value: "best-selling", label: "پرفروش‌ترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
];
function minPrice(p) { const pr = p.variants.map((v) => v.irrPrice || v.aedPrice || Infinity); return pr.length ? Math.min(...pr) : Infinity; }

export default function CategoryBrowser({ products, categories, currentSlug, currentName, currentCategory }) {
  const isParent = currentCategory?.children?.length > 0;
  const children = currentCategory?.children ?? [];
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [selectedSpecs, setSelectedSpecs] = useState(new Set());
  const [sort, setSort] = useState("newest");

  const brands = useMemo(() => [...new Set(products.map((p) => p.brand).filter(Boolean))], [products]);
  const specOptions = useMemo(() => {
    const set = new Set();
    products.forEach((p) => (p.specs ?? []).forEach((s) => { const k = s.split(":")[0]?.trim(); if (k) set.add(k); }));
    return [...set];
  }, [products]);

  const toggleSet = (set, setter, val) => setter((prev) => { const n = new Set(prev); n.has(val) ? n.delete(val) : n.add(val); return n; });

  const filtered = useMemo(() => {
    let list = [...products];
    if (isParent && selectedChild) list = list.filter((p) => p.category?.slug === selectedChild);
    if (!isParent) {
      if (selectedBrands.size) list = list.filter((p) => selectedBrands.has(p.brand));
      if (selectedSpecs.size) list = list.filter((p) => (p.specs ?? []).some((s) => selectedSpecs.has(s.split(":")[0]?.trim())));
    }
    switch (sort) {
      case "best-selling": list.sort((a, b) => (b.totalSold ?? 0) - (a.totalSold ?? 0)); break;
      case "price-asc": list.sort((a, b) => minPrice(a) - minPrice(b)); break;
      case "price-desc": list.sort((a, b) => minPrice(b) - minPrice(a)); break;
      default: list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [products, selectedChild, selectedBrands, selectedSpecs, sort, isParent]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-w-0 overflow-hidden">
      <aside className="lg:w-60 shrink-0">
        <div className="rounded-3xl border border-border/50 p-4 lg:sticky lg:top-24 flex flex-col gap-4">
          {isParent ? (
            <>
              <p className="flex items-center gap-2 font-bold text-sm"><IconFilter size={16} className="text-primary" /> زیردسته‌ها</p>
              <div className="flex flex-col gap-1">
                {children.map((ch) => (
                  <button key={ch.id} onClick={() => setSelectedChild((p) => (p === ch.slug ? null : ch.slug))} className={`text-start px-3 py-2 rounded-xl text-sm font-medium transition-colors ${selectedChild === ch.slug ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted"}`}>{ch.name}</button>
                ))}
              </div>
              {selectedChild && <button onClick={() => setSelectedChild(null)} className="text-xs text-muted-foreground hover:text-primary py-1">حذف فیلتر — همه {currentName}</button>}
            </>
          ) : (
            <>
              <p className="flex items-center gap-2 font-bold text-sm"><IconFilter size={16} className="text-primary" /> فیلترها</p>
              {brands.length > 0 && (
                <div><p className="text-xs font-semibold mb-2">برند</p><div className="flex flex-col gap-1.5">{brands.map((b) => <label key={b} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selectedBrands.has(b)} onChange={() => toggleSet(selectedBrands, setSelectedBrands, b)} className="rounded" />{b}</label>)}</div></div>
              )}
              {specOptions.length > 0 && (
                <div><p className="text-xs font-semibold mb-2">ویژگی</p><div className="flex flex-col gap-1.5">{specOptions.map((s) => <label key={s} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selectedSpecs.has(s)} onChange={() => toggleSet(selectedSpecs, setSelectedSpecs, s)} className="rounded" />{s}</label>)}</div></div>
              )}
              {(selectedBrands.size > 0 || selectedSpecs.size > 0) && <button onClick={() => { setSelectedBrands(new Set()); setSelectedSpecs(new Set()); }} className="text-xs text-muted-foreground hover:text-primary py-1">حذف فیلترها</button>}
            </>
          )}
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <p className="text-sm text-muted-foreground">{filtered.length} محصول</p>
          <label className="flex items-center gap-2 text-sm"><IconSortDescending size={16} className="text-muted-foreground" /><select value={sort} onChange={(e) => setSort(e.target.value)} className="h-9 rounded-xl border border-border bg-background px-2.5 text-sm outline-none cursor-pointer">{SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select></label>
        </div>
        {filtered.length === 0 ? <div className="flex flex-col items-center gap-3 py-24 text-muted-foreground"><IconPackageOff size={48} /><p>محصولی یافت نشد</p></div> : <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{filtered.map((p) => <SectionProductCard key={p.id} product={p} />)}</div>}
      </div>
    </div>
  );
}
