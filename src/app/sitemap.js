import { cacheTag, cacheLife } from "next/cache";
import prisma from "@/lib/prisma";
import { cacheTags } from "@/lib/data/web-store";

import { SITE_URL } from "@/lib/seo";
import { posts } from "@/lib/blog/posts";
const baseUrl = SITE_URL;

async function getSitemapData() {
  "use cache";
  cacheTag(cacheTags.products, cacheTags.categories);
  cacheLife("max");
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      select: { slug: true },
      where: { parentId: null },
    }),
    prisma.product.findMany({
      select: {
        slug: true,
        updatedAt: true,
        category: { select: { slug: true } },
      },
      where: { isActive: true },
    }),
  ]);
  return { categories, products };
}

export default async function sitemap() {
  const { categories, products } = await getSitemapData();

  const blogRoutes = posts.map((p) => ({ url: `${baseUrl}/blog/${p.slug}`, lastModified: new Date(p.date), changeFrequency: "monthly", priority: 0.6 }));
  const staticRoutes = ["", "/store", "/blog", "/terms", "/privacy"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: route === "" ? 1 : 0.7,
    })
  );

  const categoryRoutes = categories.map((c) => ({
    url: `${baseUrl}/store/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const productRoutes = products
    .filter((p) => p.category?.slug)
    .map((p) => ({
      url: `${baseUrl}/store/${p.category.slug}/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "daily",
      priority: 0.8,
    }));

  return [...staticRoutes, ...blogRoutes, ...categoryRoutes, ...productRoutes];
}
