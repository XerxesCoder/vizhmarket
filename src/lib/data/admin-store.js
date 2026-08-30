import { cacheTag, cacheLife } from "next/cache";
import prisma from "@/lib/prisma";

export const adminTags = {
  products: "products",
  categories: "categories",
  orders: "orders",
  users: "users",
};

// ── /admin/products ──
export async function getAdminProducts() {
  "use cache";
  cacheTag(adminTags.products, adminTags.categories);
  cacheLife("max");
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true, variants: { include: { attributes: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { products, categories };
}

// ── /admin/categories ──
export async function getAdminCategories() {
  "use cache";
  cacheTag(adminTags.categories);
  cacheLife("max");
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

// ── /admin/orders ──
export async function getAdminOrders() {
  "use cache";
  cacheTag(adminTags.orders);
  cacheLife("max");
  return prisma.storeOrder.findMany({
    include: {
      items: {
        include: {
          product: { select: { title: true } },
          variant: { include: { attributes: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ── /admin/users ──
export async function getAdminUsers() {
  "use cache";
  cacheTag(adminTags.users);
  cacheLife("max");
  return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
}

// ── /admin dashboard stats ──
export async function getAdminStats() {
  "use cache";
  cacheTag(adminTags.products, adminTags.categories, adminTags.orders, adminTags.users);
  cacheLife("max");
  const [products, categories, orders, users, variants] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.storeOrder.count(),
    prisma.user.count(),
    prisma.productVariant.count(),
  ]);
  return { products, categories, orders, users, variants };
}
