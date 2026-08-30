"use client";

import { useMemo, useState } from "react";
import { SectionProductCard } from "@/components/store/section-product-card";
import {
  IconChevronDown,
  IconChevronUp,
  IconSortDescending,
  IconFilter,
} from "@tabler/icons-react";

const SORTS = [
  { value: "newest", label: "جدیدترین" },
  { value: "best-selling", label: "پرفروش‌ترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
];

function minPrice(product) {
  const prices = product.variants.map((v) => v.irrPrice || v.aedPrice || Infinity);
  return prices.length ? Math.min(...prices) : Infinity;
}

export default function StoreBrowser({ products, categories, initialCategory }) {
  const [selected, setSelected] = useState(
    initialCategory ? new Set([initialCategory]) : new Set()
  );
  const [expanded, setExpanded] = useState(
    new Set(
      initialCategory
        ? categories
            .filter(
              (c) =>
                c.slug === initialCategory ||
                c.children.some((ch) => ch.slug === initialCategory)
            )
            .map((c) => c.slug)
        : []
    )
  );
  const [sort, setSort] = useState("newest");

  const toggleCategory = (slug) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });

  const toggleExpand = (slug) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });

  // Expand selection to descendants so selecting a parent also shows its children's products
  const selectedSlugs = useMemo(() => {
    const set = new Set();
    categories.forEach((cat) => {
      if (selected.has(cat.slug)) {
        set.add(cat.slug);
        cat.children.forEach((ch) => set.add(ch.slug));
      } else {
        cat.children.forEach((ch) => {
          if (selected.has(ch.slug)) set.add(ch.slug);
        });
      }
    });
    return set;
  }, [selected, categories]);

  const filtered = useMemo(() => {
    let list =
      selectedSlugs.size === 0
        ? products
        : products.filter((p) => selectedSlugs.has(p.category?.slug));
    list = [...list];
    switch (sort) {
      case "best-selling":
        list.sort((a, b) => (b.totalSold ?? 0) - (a.totalSold ?? 0));
        break;
      case "price-asc":
        list.sort((a, b) => minPrice(a) - minPrice(b));
        break;
      case "price-desc":
        list.sort((a, b) => minPrice(b) - minPrice(a));
        break;
      default:
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [products, selectedSlugs, sort]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* ── Category sidebar ── */}
      <aside className="lg:w-60 shrink-0">
        <div className="rounded-3xl border border-border/50 p-4 lg:sticky lg:top-24">
          <p className="flex items-center gap-2 font-bold text-sm mb-3">
            <IconFilter size={16} className="text-primary" />
            دسته‌بندی‌ها
          </p>
          <div className="flex flex-col gap-1">
            {categories.map((cat) => {
              const isOpen = expanded.has(cat.slug);
              const isSel = selected.has(cat.slug);
              return (
                <div key={cat.id}>
                  <div className="flex items-center">
                    {cat.children.length > 0 ? (
                      <button
                        onClick={() => toggleExpand(cat.slug)}
                        className="p-1.5 text-muted-foreground hover:text-foreground"
                        aria-label="باز/بسته"
                      >
                        {isOpen ? <IconChevronUp size={15} /> : <IconChevronDown size={15} />}
                      </button>
                    ) : (
                      <span className="w-7" />
                    )}
                    <button
                      onClick={() => toggleCategory(cat.slug)}
                      className={`flex-1 text-start px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isSel
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {cat.name}
                    </button>
                  </div>

                  {isOpen &&
                    cat.children.map((child) => {
                      const isChildSel = selected.has(child.slug);
                      return (
                        <button
                          key={child.id}
                          onClick={() => toggleCategory(child.slug)}
                          className={`flex items-center gap-2 w-full text-start ps-12 pe-3 py-2 rounded-xl text-sm transition-colors ${
                            isChildSel
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${isChildSel ? "bg-primary" : "bg-border"}`}
                          />
                          {child.name}
                        </button>
                      );
                    })}
                </div>
              );
            })}
          </div>

          {selected.size > 0 && (
            <button
              onClick={() => setSelected(new Set())}
              className="mt-3 w-full text-xs text-muted-foreground hover:text-primary py-2 transition-colors"
            >
              حذف فیلترها ({selected.size})
            </button>
          )}
        </div>
      </aside>

      {/* ── Products ── */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <p className="text-sm text-muted-foreground">{filtered.length} محصول</p>
          <label className="flex items-center gap-2 text-sm">
            <IconSortDescending size={16} className="text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-9 rounded-xl border border-border bg-background px-2.5 text-sm outline-none focus-visible:border-ring cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            محصولی با این فیلترها پیدا نشد
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filtered.map((product) => (
              <SectionProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

