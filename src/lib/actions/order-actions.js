"use server";

import prisma from "@/lib/prisma";
import { revalidateTag, updateTag } from "next/cache";
import { cacheTags } from "@/lib/data/web-store";
import { adminTags } from "@/lib/data/admin-store";

export async function createStoreOrder(orderData) {
  const {
    customerName,
    customerPhone,
    customerEmail,
    shippingAddress,
    items,
    note,
  } = orderData ?? {};

  if (!customerName || !customerPhone || !shippingAddress) {
    return { error: "اطلاعات ارسالی ناقص است" };
  }
  if (!Array.isArray(items) || items.length === 0) {
    return { error: "سبد سفارش خالی است" };
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { phone: customerPhone },
        update: {
          name: customerName,
          ...(customerEmail && { email: customerEmail }),
        },
        create: {
          phone: customerPhone,
          name: customerName,
          email: customerEmail || null,
          role: "USER",
        },
      });

      const variantIds = items.map((i) => i.variantId).filter(Boolean);
      const variants = await tx.productVariant.findMany({
        where: { id: { in: variantIds } },
      });

      const created = await tx.storeOrder.create({
        data: {
          userId: user.id,
          shippingAddress,
          note: note,
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
                unitIrrPrice:
                  (variant?.irrPrice ?? 0) * Math.max(1, item.quantity ?? 1),
              };
            }),
          },
        },
        include: { items: true },
      });

      return created;
    });

    return { success: true, orderId: order.id };
  } catch (err) {
    console.error("createStoreOrder failed:", err);
    return { error: "خطا در ثبت سفارش" };
  }
}

// ============================================================
// ORDER LOOKUP BY ZARINPAL AUTHORITY (unique per order/payment).
// Used by the /checkout/result page to show what was bought.
// Returns only display-safe fields — never customer phone/email internals.
// ============================================================
export async function getOrderByAuthority(authority) {
  if (!authority) return null;
  try {
    const order = await prisma.storeOrder.findUnique({
      where: { zarinpalauth: authority },
      select: {
        id: true,
        status: true,
        zarinpalref: true,

        createdAt: true,
        user: true,
        items: {
          select: {
            id: true,
            quantity: true,
            unitIrrPrice: true,
            product: {
              select: {
                title: true,
                slug: true,
                images: true,
                category: { select: { slug: true } },
              },
            },
            variant: { include: { attributes: true } },
          },
        },
      },
    });
    if (!order) return null;

    const total = order.items.reduce(
      (sum, i) => sum + (i.unitIrrPrice ?? 0),
      0,
    );
    return { ...order, total };
  } catch (err) {
    console.error("getOrderByAuthority failed:", err);
    return null;
  }
}

// ============================================================
// PAYMENT FINALIZATION — runs only after the user fully pays via Zarinpal.
// totalSold increment + stock decrement happen HERE (never at order creation),
// because an unpaid order must not consume inventory.
// ============================================================
export async function finishOrder({ authority, refId, sendSms = false } = {}) {
  try {
    const existing = await prisma.storeOrder.findUnique({
      where: { zarinpalauth: authority },
      include: {
        user: true,
      },
    });

    if (!existing) {
      return { error: "سفارش یافت نشد" };
    }
    if (existing.status !== "SUBMITTED") {
      return { success: true, already: true, orderId: existing.id };
    }

    const finalized = await prisma.$transaction(async (tx) => {
      const order = await tx.storeOrder.update({
        where: { id: existing.id },
        data: {
          status: "PAID",
          zarinpalref: String(refId),
        },
        include: { items: true },
      });

      for (const item of order.items) {
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

      return order;
    });

    revalidateTag(cacheTags.products);
    revalidateTag(adminTags.orders);

    if (sendSms && existing.user.phone) {
      try {
        const { sendFinalSMS } = await import("@/lib/actions/sms");
        await sendFinalSMS(
          existing.user.phone,
          finalized.id,
          finalized.zarinpalref,
        );
      } catch (smsErr) {
        console.error("Final SMS failed:", smsErr);
      }
    }

    return { success: true, orderId: finalized.id, status: finalized.status };
  } catch (err) {
    console.error("finishOrder failed:", err);
    return { error: "خطا در نهایی‌سازی سفارش" };
  }
}
