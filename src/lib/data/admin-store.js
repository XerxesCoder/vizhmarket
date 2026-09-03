import { cacheTag, cacheLife } from "next/cache";
import prisma from "@/lib/prisma";

export const adminTags = {
  products: "products",
  categories: "categories",
  orders: "orders",
  users: "users",
  exchangeRate: "exchangeRate",
};

export async function getExchangeRate() {
  "use cache";
  cacheTag(adminTags.exchangeRate);
  cacheLife("max");
  const rate = await prisma.exchangeRate.findFirst({ where: { isActive: true }, orderBy: { updatedAt: "desc" } });
  return rate?.aedToIrr ?? null;
}

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
      // Customer fields live on the `user` relation (StoreOrder has no name/phone columns).
      user: { select: { id: true, name: true, phone: true, email: true } },
      items: {
        include: {
          product: { select: { title: true, slug: true, images: true } },
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
  return prisma.user.findMany({
    include: {
      storeOrders: {
        include: {
          items: {
            include: {
              product: { select: { title: true } },
              variant: { include: { attributes: true } },
            },
          },
        },
      },
      webOrders: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

// ── /admin/users/[id] ── user profile + full order history (store + web)
export async function getAdminUserOrders(id) {
  "use cache";
  cacheTag(adminTags.users, adminTags.orders);
  cacheLife("max");
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      storeOrders: {
        include: {
          items: {
            include: {
              product: { select: { title: true, slug: true, images: true } },
              variant: { include: { attributes: true } },
            },
          },
          //orderBy: { createdAt: "desc" },
        },
      },
      webOrders: true,
    },
  });
  return user;
}

// ── /admin dashboard stats ──
export async function getAdminStats() {
  "use cache";
  cacheTag(adminTags.products, adminTags.categories, adminTags.orders, adminTags.users);
  cacheLife("max");
  const [products, users, pendingOrders, totalSoldAgg] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.storeOrder.count({ where: { status: "SUBMITTED" } }),
    prisma.storeOrderItem.aggregate({ _sum: { unitIrrPrice: true } }),
  ]);
  return { products, users, pendingOrders, totalSold: totalSoldAgg._sum.unitIrrPrice || 0 };
}
