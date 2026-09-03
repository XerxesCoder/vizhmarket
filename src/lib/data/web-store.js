import { cacheTag, cacheLife } from "next/cache";
import prisma from "@/lib/prisma";

// Cache tags — used by both query caching and server-action revalidation
export const cacheTags = {
  products: "products",
  categories: "categories",
};

const includeProduct = {
  category: true,
  variants: { include: { attributes: true } },
};

// ── Shared nav categories (roots + children) for Header / Footer / Landing ──
export async function getNavCategories() {
  "use cache";
  cacheTag(cacheTags.categories);
  cacheLife("max");
  return prisma.category.findMany({
    where: { parentId: null },
    include: { children: { orderBy: { name: "asc" } } },
    orderBy: { name: "asc" },
  });
}

// ── Landing (/) ──
export async function getLandingData() {
  "use cache";
  cacheTag(cacheTags.products, cacheTags.categories);
  cacheLife("max");
  const [roots, bestSellers] = await Promise.all([
      prisma.category.findMany({
        where: { parentId: null },
        include: {
          children: {
            include: { products: { where: { isActive: true }, include: includeProduct } },
          },
          products: { where: { isActive: true }, include: includeProduct },
        },
        orderBy: { name: "asc" },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        include: includeProduct,
        orderBy: { totalSold: "desc" },
        take: 10,
      }),
    ]);

    const sections = roots
      .map((root) => {
        const categoryProducts = [
          ...root.products,
          ...root.children.flatMap((c) => c.products),
        ].slice(0, 12);
        return { category: root, products: categoryProducts };
      })
      .filter((s) => s.products.length > 0);

    return { sections, bestSellers };
}

// ── /store ──
export async function getStoreData() {
  "use cache";
  cacheTag(cacheTags.products, cacheTags.categories);
  cacheLife("max");
  const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        include: {
          category: { include: { parent: true } },
          variants: { include: { attributes: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        where: { parentId: null },
        include: { children: { orderBy: { name: "asc" } } },
        orderBy: { name: "asc" },
      }),
    ]);
    return { products, categories };
}

// ── Build-time slug lists for generateStaticParams ──
export async function getCategorySlugs() {
  "use cache";
  cacheTag(cacheTags.categories);
  cacheLife("max");
  return prisma.category.findMany({ select: { slug: true } });
}

export async function getProductSlugs() {
  "use cache";
  cacheTag(cacheTags.products, cacheTags.categories);
  cacheLife("max");
  return prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, category: { select: { slug: true } } },
  });
}

// ── /store/[category] ──
export async function getCategoryPage(slug) {
  "use cache";
  cacheTag(cacheTags.products, cacheTags.categories);
  cacheLife("max");
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { parent: true, children: { orderBy: { name: "asc" } } },
  });
  if (!category) return null;

  const categoryIds = [category.id, ...category.children.map((c) => c.id)];
  const products = await prisma.product.findMany({
    where: { categoryId: { in: categoryIds }, isActive: true },
    include: { variants: { include: { attributes: true } }, category: true },
    orderBy: { totalSold: "desc" },
  });

  return { ...category, products };
}

// ── /store/[category]/[product] ──
export async function getProductPage(categorySlug, productSlug) {
  "use cache";
  cacheTag(cacheTags.products, cacheTags.categories);
  cacheLife("max");
  const product = await prisma.product.findFirst({
    where: { slug: productSlug, category: { slug: categorySlug }, isActive: true },
    include: {
      category: { include: { parent: true } },
      variants: { orderBy: { isDefault: "desc" }, include: { attributes: true } },
    },
  });
  if (!product) return null;
  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, isActive: true, id: { not: product.id } },
    include: { category: true, variants: { include: { attributes: true } } },
    orderBy: { totalSold: "desc" },
    take: 3,
  });
  return { ...product, related };
}
