import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Client-side cart, persisted to localStorage.
// Each line is one product+variant combination, keyed by `key`
// (productId for products without variants, `${productId}:${variantId}` otherwise).
// Prices/stock/title are snapshotted at add-to-cart time; stock is re-clamped in the UI.

export const useCartStore = create()(
  persist(
    (set, get) => ({
      items: [],

      // item: { productId, variantId?, slug, categorySlug, title, image,
      //         variantLabel?, irrPrice, aedPrice, stock, quantity }
      addItem: (item) =>
        set((state) => {
          const qty = Math.max(1, item.quantity ?? 1);
          const key = item.variantId ? `${item.productId}:${item.variantId}` : item.productId;
          const existing = state.items.find((i) => i.key === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.key === key
                  ? { ...i, quantity: Math.min(i.stock, i.quantity + qty) }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                key,
                productId: item.productId,
                variantId: item.variantId ?? null,
                slug: item.slug,
                categorySlug: item.categorySlug,
                title: item.title,
                image: item.image ?? null,
                variantLabel: item.variantLabel ?? null,
                irrPrice: item.irrPrice ?? 0,
                aedPrice: item.aedPrice ?? 0,
                stock: Math.max(1, item.stock ?? 1),
                quantity: qty,
              },
            ],
          };
        }),

      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((i) => i.key !== key) })),

      setQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.key === key
              ? { ...i, quantity: Math.min(i.stock, Math.max(1, quantity)) }
              : i
          ),
        })),

      clear: () => set({ items: [] }),

      totalQuantity: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalIrr: () =>
        get().items.reduce((sum, i) => sum + i.irrPrice * i.quantity, 0),
      totalAed: () =>
        get().items.reduce((sum, i) => sum + i.aedPrice * i.quantity, 0),
    }),
    {
      name: "vizhmarket-cart",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);

// Hydration note: zustand persist rehydrates asynchronously on the client, so
// server-rendered markup must not depend on cart contents. Components gate
// cart-dependent UI behind `useMounted()` — false on the server snapshot,
// true on every client render, with no setState-in-effect.
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot
    () => false // server snapshot
  );
}
