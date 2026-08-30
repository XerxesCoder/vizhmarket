"use server";

import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { cacheTags } from "@/lib/data/web-store";

// Creates a StoreOrder from checkout items and increments each product's totalSold.
// items: [{ productId, variantId?, quantity }]
export async function createStoreOrder(orderData) {
  const { customerName, customerPhone, customerEmail, shippingAddress, userId, items } = orderData ?? {};

  if (!customerName || !customerPhone || !shippingAddress) {
    return { error: "اطلاعات ارسالی ناقص است" };
  }
  if (!Array.isArray(items) || items.length === 0) {
    return { error: "سبد سفارش خالی است" };
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      // Fetch variants for price snapshots
      const variantIds = items.map((i) => i.variantId).filter(Boolean);
      const variants = await tx.productVariant.findMany({
        where: { id: { in: variantIds } },
      });

      const created = await tx.storeOrder.create({
        data: {
          userId: userId ?? null,
          customerName,
          customerPhone,
          customerEmail: customerEmail || null,
          shippingAddress,
          status: "SUBMITTED",
          items: {
            create: items.map((item) => {
              const variant = item.variantId
                ? variants.find((v) => v.id === item.variantId)
                : null;
              return {
                productId: item.productId,
                variantId: item.variantId ?? null,
                quantity: Math.max(1, item.quantity ?? 1),
                unitAedPrice: variant?.aedPrice ?? 0,
                unitIrrPrice: (variant?.irrPrice ?? 0) * Math.max(1, item.quantity ?? 1),
              };
            }),
          },
        },
        include: { items: true },
      });

      // Increment sold counters + decrement stock
      for (const item of created.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { totalSold: { increment: item.quantity } },
        });
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      return created;
    });

    // totalSold feeds home best-sellers + store listings → tag-based revalidation
    revalidateTag(cacheTags.products);
    return { success: true, orderId: order.id };
  } catch (err) {
    console.error("createStoreOrder failed:", err);
    return { error: "خطا در ثبت سفارش" };
  }
}
