"use server";

import prisma from "@/lib/prisma";
import { revalidateTag, updateTag } from "next/cache";
import { cacheTags } from "@/lib/data/web-store";
import { adminTags } from "@/lib/data/admin-store";

// ---------- Helpers ----------
function slugify(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function str(fd, key) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function num(fd, key, fallback = 0) {
  const v = Number(fd.get(key));
  return Number.isFinite(v) ? v : fallback;
}

function bool(fd, key, fallback = false) {
  const v = fd.get(key);
  if (v === null) return fallback;
  return v === "on" || v === "true" || v === "1";
}

function optionalStr(fd, key) {
  const v = str(fd, key);
  return v === "" ? null : v;
}

// Parses one URL per line (textarea) into an image array
function lines(fd, key) {
  const v = str(fd, key);
  if (!v) return [];
  return v
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function numOrNull(fd, key) {
  const v = num(fd, key, NaN);
  return Number.isFinite(v) && v > 0 ? v : null;
}

// Any catalog change (product/variant/category) invalidates webapp + admin caches.
// updateTag (Server-Action-only) gives read-your-own-writes: the next read is fresh.
function revalidateCatalog() {
  updateTag(cacheTags.products);
  updateTag(cacheTags.categories);
}

// ---------- SKU + Asset Helpers ----------
// SKUs are auto-generated from slugs (readable, human-friendly).
function generateProductSku(slug) {
  return `SKU-${slug}`;
}

function generateVariantSku(productSlug, index) {
  return `SKU-${productSlug}-${String(index).padStart(2, "0")}`;
}

// Normalize a local asset path so it is always served from the public `/assets` folder.
// http/https/data/blob URLs and already-rooted paths are passed through untouched.
function normalizeAssetPath(p) {
  if (!p) return p;
  let n = p.replace(/\\/g, "/").trim();
  if (/^(https?:)?\/\//.test(n) || /^data:/i.test(n) || /^blob:/i.test(n) || n.startsWith("/")) return n;
  return `/${n}`;
}

// Single optional image (category) — normalized path
function assetPath(fd, key) {
  return normalizeAssetPath(optionalStr(fd, key));
}

// One local asset path per line (product / variant) — normalized
function assetPaths(fd, key) {
  return lines(fd, key).map(normalizeAssetPath);
}

// ---------- Product Actions ----------
export async function createProduct(formData) {
  const title = str(formData, "title");
  if (!title) return { error: "عنوان محصول الزامی است" };
  const inputSlug = str(formData, "slug");

  const slug = slugify(inputSlug);
  if (!slug) return { error: "اسلاگ (Slug) الزامی است" };

  const categoryId = str(formData, "categoryId");
  if (!categoryId) return { error: "دسته‌بندی الزامی است" };

  const images = assetPaths(formData, "images");
  if (images.length === 0) return { error: "حداقل یک تصویر الزامی است" };

  try {
    await prisma.product.create({
      data: {
        title,
        slug,
        sku: generateProductSku(slug),
        brand: optionalStr(formData, "brand"),
        url: optionalStr(formData, "url"),
        description: optionalStr(formData, "description"),
        images,
        specs: specsFrom(formData),
        isActive: bool(formData, "isActive"),
        isExpress: bool(formData, "isExpress"),
        categoryId,
      },
    });
    revalidateCatalog();
    return { success: true };
  } catch (err) {
    if (err?.code === "P2002")
      return { error: "محصولی با این اسلاگ یا SKU وجود دارد" };
    console.error("createProduct failed:", err);
    return { error: "خطا در ایجاد محصول" };
  }
}

export async function updateProduct(formData) {
  const id = str(formData, "id");
  if (!id) return { error: "محصول یافت نشد" };

  const title = str(formData, "title");
  const inputSlug = str(formData, "slug");
  const slug = slugify(inputSlug);
  const categoryId = str(formData, "categoryId");
  const images = assetPaths(formData, "images");

  try {
    await prisma.product.update({
      where: { id },
      data: {
        ...(title && { title }),
        // When slug changes, the auto-generated SKU follows it
        ...(slug && { slug, sku: generateProductSku(slug) }),
        brand: optionalStr(formData, "brand"),
        url: optionalStr(formData, "url"),
        description: optionalStr(formData, "description"),
        ...(images.length > 0 && { images }),
        specs: specsFrom(formData),
        isActive: bool(formData, "isActive", true),
        isExpress: bool(formData, "isExpress"),
        ...(categoryId && { categoryId }),
      },
    });
    revalidateCatalog();
    return { success: true };
  } catch (err) {
    if (err?.code === "P2002")
      return { error: "محصولی با این اسلاگ یا SKU وجود دارد" };
    console.error("updateProduct failed:", err);
    return { error: "خطا در ویرایش محصول" };
  }
}

export async function deleteProduct(formData) {
  const id = str(formData, "id");
  if (!id) return { error: "محصول یافت نشد" };
  try {
    await prisma.product.delete({ where: { id } });
    revalidateCatalog();
    return { success: true };
  } catch (err) {
    if (err?.code === "P2003")
      return { error: "این محصول در سفارش‌هایی استفاده شده و قابل حذف نیست" };
    console.error("deleteProduct failed:", err);
    return { error: "خطا در حذف محصول" };
  }
}

// ---------- Bulk Helpers ----------
function idsFrom(fd) {
  const ids = fd.getAll("ids");
  return ids.map((v) => String(v).trim()).filter(Boolean);
}

// Reads key/value attribute pairs from two separate repeatable inputs (attrKey / attrValue).
// Empty rows (missing key or value) are dropped.
function attributesFrom(fd) {
  const keys = fd.getAll("attrKey").map((v) => String(v).trim());
  const values = fd.getAll("attrValue").map((v) => String(v).trim());
  const attrs = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = values[i] ?? "";
    if (key && value) attrs.push({ key, value });
  }
  return attrs;
}

// Reads product spec pairs (specKey / specValue) and flattens each one to a
// single "key: value" string, matching the String[] layout in the schema.
function specsFrom(fd) {
  const keys = fd.getAll("specKey").map((v) => String(v).trim());
  const values = fd.getAll("specValue").map((v) => String(v).trim());
  const specs = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = values[i] ?? "";
    if (key && value) specs.push(`${key}: ${value}`);
  }
  return specs;
}

// Ensures only ONE default variant per product (unsets others, keeps `exceptId`)
async function unsetOtherDefaults(productId, exceptId) {
  await prisma.productVariant.updateMany({
    where: {
      productId,
      isDefault: true,
      ...(exceptId ? { NOT: { id: exceptId } } : {}),
    },
    data: { isDefault: false },
  });
}

// ---------- Variant Actions ----------
export async function createVariant(formData) {
  const productId = str(formData, "productId");
  if (!productId) return { error: "محصول یافت نشد" };

  const attributes = attributesFrom(formData);

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { slug: true },
    });
    if (!product) return { error: "محصول یافت نشد" };
    const variantCount = await prisma.productVariant.count({
      where: { productId },
    });

    const created = await prisma.productVariant.create({
      data: {
        productId,
        attributes: { create: attributes },
        sku: generateVariantSku(product.slug, variantCount + 1),
        images: assetPaths(formData, "images"),
        aedPrice: num(formData, "aedPrice", 0),
        irrPrice: num(formData, "irrPrice", 0),
        stock: num(formData, "stock", 0),
        isDefault: bool(formData, "isDefault"),
      },
    });
    if (created.isDefault) await unsetOtherDefaults(productId, created.id);
    revalidateCatalog();
    return { success: true };
  } catch (err) {
    if (err?.code === "P2002")
      return { error: "ویژگی‌ای با این SKU وجود دارد" };
    console.error("createVariant failed:", err);
    return { error: "خطا در افزودن ویژگی" };
  }
}

export async function updateVariant(formData) {
  const id = str(formData, "id");
  if (!id) return { error: "ویژگی یافت نشد" };
  const attributes = attributesFrom(formData);
  const aedRaw = numOrNull(formData, "aedPrice");
  const irrRaw = numOrNull(formData, "irrPrice");
  try {
    const variant = await prisma.productVariant.findUnique({
      where: { id },
      select: { productId: true },
    });
    if (!variant) return { error: "ویژگی یافت نشد" };
    await prisma.$transaction(async (tx) => {
      await tx.productVariant.update({
        where: { id },
        data: {
          images: assetPaths(formData, "images"),
          ...(aedRaw !== null && { aedPrice: aedRaw }),
          ...(irrRaw !== null && { irrPrice: irrRaw }),
          stock: num(formData, "stock"),
          isDefault: bool(formData, "isDefault"),
        },
      });
      await tx.variantAttribute.deleteMany({ where: { variantId: id } });
      if (attributes.length > 0) {
        await tx.variantAttribute.createMany({
          data: attributes.map((a) => ({
            variantId: id,
            key: a.key,
            value: a.value,
          })),
        });
      }
    });
    if (bool(formData, "isDefault"))
      await unsetOtherDefaults(variant.productId, id);
    revalidateCatalog();
    return { success: true };
  } catch (err) {
    console.error("updateVariant failed:", err);
    return { error: "خطا در ویرایش ویژگی" };
  }
}

export async function deleteVariant(formData) {
  const id = str(formData, "id");
  if (!id) return { error: "ویژگی یافت نشد" };
  try {
    await prisma.productVariant.delete({ where: { id } });
    revalidateCatalog();
    return { success: true };
  } catch (err) {
    if (err?.code === "P2003")
      return { error: "این ویژگی در سفارش‌ها استفاده شده و قابل حذف نیست" };
    console.error("deleteVariant failed:", err);
    return { error: "خطا در حذف ویژگی" };
  }
}

// ---------- Category Actions ----------
export async function createCategory(formData) {
  const name = str(formData, "name");
  if (!name) return { error: "نام دسته‌بندی الزامی است" };
  const inputSlug = str(formData, "slug");
  const slug = slugify(inputSlug);
  if (!slug) return { error: "اسلاگ (Slug) الزامی است" };

  const parentId = optionalStr(formData, "parentId") || undefined;
  try {
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        image: assetPath(formData, "image"),
        parentId,
      },
    });
    revalidateCatalog();
    // Return the created category so callers (e.g. the product form's inline
    // category dialog) can append + auto-select it without a refetch.
    return { success: true, category: { id: category.id, name: category.name } };
  } catch (err) {
    if (err?.code === "P2002") return { error: "دسته‌بندی یا اسلاگ تکراری" };
    console.error("createCategory failed:", err);
    return { error: "خطا در ایجاد دسته‌بندی" };
  }
}

export async function updateCategory(formData) {
  const id = str(formData, "id");
  if (!id) return { error: "دسته‌بندی یافت نشد" };
  const name = str(formData, "name");
  const inputSlug = str(formData, "slug");
  const slug = slugify(inputSlug);
  try {
    await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        // Slug is edited explicitly by the user, so only update it when provided
        ...(slug && { slug }),
        image: assetPath(formData, "image"),
        parentId: optionalStr(formData, "parentId") || undefined,
      },
    });
    revalidateCatalog();
    return { success: true };
  } catch (err) {
    if (err?.code === "P2002") return { error: "اسلاگ تکراری" };
    console.error("updateCategory failed:", err);
    return { error: "خطا در ویرایش دسته‌بندی" };
  }
}

export async function deleteCategory(formData) {
  const id = str(formData, "id");
  if (!id) return { error: "دسته‌بندی یافت نشد" };
  try {
    await prisma.category.delete({ where: { id } });
    revalidateCatalog();
    return { success: true };
  } catch (err) {
    if (err?.code === "P2003")
      return { error: "این دسته‌بندی محصول یا زیر‌دسته دارد" };
    console.error("deleteCategory failed:", err);
    return { error: "خطا در حذف دسته‌بندی" };
  }
}

export async function deleteCategories(formData) {
  const ids = idsFrom(formData);
  if (ids.length === 0) return { error: "دسته‌بندی‌ای انتخاب نشده" };
  try {
    await prisma.category.deleteMany({ where: { id: { in: ids } } });
    revalidateCatalog();
    return { success: true, count: ids.length };
  } catch (err) {
    if (err?.code === "P2003")
      return { error: "برخی دسته‌بندی‌ها محصول یا زیر‌دسته دارند" };
    console.error("deleteCategories failed:", err);
    return { error: "خطا در حذف دسته‌بندی‌ها" };
  }
}

// ---------- Bulk Product/Variant Delete ----------
export async function deleteProducts(formData) {
  const ids = idsFrom(formData);
  if (ids.length === 0) return { error: "محصولی انتخاب نشده" };
  try {
    await prisma.product.deleteMany({ where: { id: { in: ids } } });
    revalidateCatalog();
    return { success: true, count: ids.length };
  } catch (err) {
    if (err?.code === "P2003")
      return { error: "برخی محصولات در سفارش‌ها استفاده شده‌اند" };
    console.error("deleteProducts failed:", err);
    return { error: "خطا در حذف محصولات" };
  }
}

export async function deleteVariants(formData) {
  const ids = idsFrom(formData);
  if (ids.length === 0) return { error: "ویژگی‌ای انتخاب نشده" };
  try {
    await prisma.productVariant.deleteMany({ where: { id: { in: ids } } });
    revalidateCatalog();
    return { success: true, count: ids.length };
  } catch (err) {
    if (err?.code === "P2003")
      return { error: "برخی ویژگی‌ها در سفارش‌ها استفاده شده‌اند" };
    console.error("deleteVariants failed:", err);
    return { error: "خطا در حذف ویژگی‌ها" };
  }
}

// ---------- Order Actions ----------
const VALID_ORDER_STATUS = [
  "SUBMITTED",
  "PAID",
  "BOUGHT",
  "SHIPPED_BY_STORE",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export async function updateOrderStatus(formData) {
  const id = str(formData, "id");
  const status = str(formData, "status");
  if (!id) return { error: "سفارش یافت نشد" };
  if (!VALID_ORDER_STATUS.includes(status)) return { error: "وضعیت نامعتبر" };
  try {
    await prisma.storeOrder.update({ where: { id }, data: { status } });
    updateTag(adminTags.orders);
    return { success: true };
  } catch (err) {
    console.error("updateOrderStatus failed:", err);
    return { error: "خطا در بروزرسانی وضعیت" };
  }
}

export async function deleteOrder(formData) {
  const id = str(formData, "id");
  if (!id) return { error: "سفارش یافت نشد" };
  try {
    await prisma.storeOrder.delete({ where: { id } });
    updateTag(adminTags.orders);
    return { success: true };
  } catch (err) {
    console.error("deleteOrder failed:", err);
    return { error: "خطا در حذف سفارش" };
  }
}

// ---------- User Actions ----------
const VALID_ROLES = ["USER", "ADMIN"];

export async function updateUserRole(formData) {
  const id = str(formData, "id");
  const role = str(formData, "role");
  if (!id) return { error: "کاربر یافت نشد" };
  if (!VALID_ROLES.includes(role)) return { error: "نقش نامعتبر" };
  try {
    await prisma.user.update({ where: { id }, data: { role } });
    updateTag(adminTags.users);
    return { success: true };
  } catch (err) {
    console.error("updateUserRole failed:", err);
    return { error: "خطا در بروزرسانی نقش" };
  }
}

export async function deleteUser(formData) {
  const id = str(formData, "id");
  if (!id) return { error: "کاربر یافت نشد" };
  try {
    await prisma.user.delete({ where: { id } });
    updateTag(adminTags.users);
    return { success: true };
  } catch (err) {
    console.error("deleteUser failed:", err);
    return { error: "خطا در حذف کاربر" };
  }
}

// ---------- Full revalidation (e.g. after seed/migration) ----------
export async function updateExchangeRate(formData) {
  const rate = num(formData, "aedToIrr", NaN);
  if (!Number.isFinite(rate) || rate <= 0) return { error: "نرخ معتبر وارد کنید" };
  const existing = await prisma.exchangeRate.findFirst({ where: { isActive: true } });
  if (existing) await prisma.exchangeRate.update({ where: { id: existing.id }, data: { aedToIrr: rate } });
  else await prisma.exchangeRate.create({ data: { aedToIrr: rate, isActive: true } });
  const recalc = bool(formData, "recalculate");
  if (recalc) await recalculateVariantPrices(rate);
  updateTag(adminTags.exchangeRate);
  return { success: true };
}

export async function recalculateVariantPrices(rate) {
  const variants = await prisma.productVariant.findMany({ where: { aedPrice: { gt: 0 }, stock: { gt: 0 } }, select: { id: true, aedPrice: true } });
  for (const v of variants) {
    await prisma.productVariant.update({ where: { id: v.id }, data: { irrPrice: Math.round(v.aedPrice * rate) } });
  }
  updateTag(cacheTags.products);
  return { success: true, count: variants.length };
}

export async function revalidateWebTags() {
  "use server";
  for (const t of Object.values(cacheTags)) updateTag(t);
  return { success: true };
}
export async function revalidateAllTags() {
  "use server";
  const tags = new Set([...Object.values(cacheTags), ...Object.values(adminTags)]);
  for (const t of tags) updateTag(t);
  return { success: true, tags: [...tags] };
}
