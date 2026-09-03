/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionProductCard } from "@/components/store/section-product-card";
import {
  IconChevronDown,
  IconChevronUp,
  IconSortDescending,
  IconFilter,
  IconSearch,
} from "@tabler/icons-react";

const SORTS = [
  { value: "newest", label: "جدیدترین" },
  { value: "best-selling", label: "پرفروش‌ترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
];

function minPrice(product) {
  const prices = product.variants.map(
    (v) => v.irrPrice || v.aedPrice || Infinity,
  );
  return prices.length ? Math.min(...prices) : Infinity;
}

export default function StoreBrowser({
  products,
  categories,
  initialCategory,
  initialSearch = "",
}) {
  const [selected, setSelected] = useState(initialCategory || null);
  const [query, setQuery] = useState(initialSearch);
  useEffect(() => setQuery(initialSearch), [initialSearch]);
  const [expanded, setExpanded] = useState(
    new Set(
      initialCategory
        ? categories
            .filter(
              (c) =>
                c.slug === initialCategory ||
                c.children.some((ch) => ch.slug === initialCategory),
            )
            .map((c) => c.slug)
        : [],
    ),
  );
  const [sort, setSort] = useState("newest");

  const toggleCategory = (slug) => {
    setSelected((prev) => (prev === slug ? null : slug));
    const cat = categories.find((c) => c.slug === slug);
    if (cat?.children.length) setExpanded((prev) => new Set(prev).add(slug));
  };

  const toggleExpand = (slug) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });

  const selectedSlugs = useMemo(() => {
    if (!selected) return new Set();
    const set = new Set([selected]);
    categories.forEach((cat) => {
      if (cat.slug === selected) cat.children.forEach((ch) => set.add(ch.slug));
      else if (cat.children.some((ch) => ch.slug === selected))
        set.add(selected);
    });
    return set;
  }, [selected, categories]);

  const filtered = useMemo(() => {
    let list =
      selectedSlugs.size === 0
        ? products
        : products.filter((p) => selectedSlugs.has(p.category?.slug));
    const q = query.trim().toLowerCase();
    if (q)
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q),
      );
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
  }, [products, selectedSlugs, sort, query]);

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
              const isSel = selected === cat.slug;
              return (
                <div key={cat.id}>
                  <div className="flex items-center">
                    {cat.children.length > 0 ? (
                      <button
                        onClick={() => toggleExpand(cat.slug)}
                        className="p-1.5 text-muted-foreground hover:text-foreground"
                        aria-label="باز/بسته"
                      >
                        {isOpen ? (
                          <IconChevronUp size={15} />
                        ) : (
                          <IconChevronDown size={15} />
                        )}
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
                      const isChildSel = selected === child.slug;
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

          {selected && (
            <button
              onClick={() => setSelected(null)}
              className="mt-3 w-full text-xs text-muted-foreground hover:text-primary py-2 transition-colors"
            >
              حذف فیلتر
            </button>
          )}
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <IconSearch
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو نام یا برند..."
              className="w-full h-9 rounded-xl border border-border bg-background pe-3 ps-9 text-sm outline-none focus-visible:border-ring"
            />
          </div>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              پاک کردن
            </button>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <p className="text-sm text-muted-foreground">
            {filtered.length} محصول
          </p>
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
