"use server";

import prisma from "@/lib/prisma";
import { zarinpal } from "@/lib/zarinpal";
import { finishOrder } from "./order-actions";

// Zarinpal amounts are in IRT (Iranian Rial).; 1 Toman = 10 Rial.

const TOMAN_TO_IRT = 10;

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

function getCallbackUrl() {
  return process.env.ZARINPAL_CALLBACK;
}

async function computeOrderTotal(order) {
  const items = Array.isArray(order.items)
    ? order.items
    : await prisma.storeOrderItem.findMany({
        where: { orderId: order.id },
      });

  return items.reduce((sum, i) => sum + (i.unitIrrPrice ?? 0), 0);
}

export async function createZarinpalPayment(orderId) {
  try {
    const order = await prisma.storeOrder.findUnique({
      where: { id: orderId },
      include: { items: true, user: true },
    });
    if (!order) return { error: "سفارش یافت نشد" };
    if (order.status !== "SUBMITTED")
      return { error: "این سفارش قبلاً پرداخت شده است" };

    const totalToman = await computeOrderTotal(order);
    if (!totalToman || totalToman <= 0)
      return { error: "مبلغ سفارش نامعتبر است" };

    const response = await zarinpal.payments.create({
      callback_url: process.env.ZARINPAL_CALLBACK,
      amount: totalToman,
      description: `خرید از ویژ مارکت - ${order.user.name}`,
      mobile: order.user.phone,
      currency: "IRT",
    });

    if (!response.data?.authority) throw new Error("خطا در انتقال به درگاه");

    const authority = response.data.authority;

    await prisma.storeOrder.update({
      where: { id: order.id },
      data: { zarinpalauth: authority },
    });

    const redirectUrl = await zarinpal.payments.getRedirectUrl(authority);

    return { success: true, url: redirectUrl, authority };
  } catch (error) {
    console.error("Payment creation error:", error);
    return { error: error.message };
  }
}

async function getStoreOrderByAuthority(authority) {
  try {
    return await prisma.storeOrder.findFirst({
      where: { zarinpalauth: authority },
      include: { items: true },
    });
  } catch (err) {
    console.error("Error fetching order:", err);
    return null;
  }
}

export async function verifyZarinpalPayment(authority, status) {
  try {
    const order = await getStoreOrderByAuthority(authority);
    if (!order) return { error: "هیچ سفارشی برای این کد تأیید یافت نشد" };

    if (status === "OK") {
      const totalToman = await computeOrderTotal(order);
      if (!totalToman) return { error: "مبلغ سفارش نامعتبر است" };

      const response = await zarinpal.verifications.verify({
        amount: totalToman,
        authority,
      });

      console.log("Zarinpal verify response:", JSON.stringify(response?.data));

      if (response.data?.code === 100 || response.data?.code === 101) {
        // finishOrder looks the order up by the unique authority itself.
        const final = await finishOrder({
          authority,
          refId: response.data.ref_id,
        });

        if (final?.error) {
          return { error: final.error };
        }

        return {
          success: true,
          data: response?.data,
          orderData: final,
          message:
            response.data.code === 100
              ? "Payment Verified"
              : "Payment already verified",
        };
      }

      return { error: "پرداخت تأیید نشد" };
    }

    return { error: "پرداخت لغو یا ناموفق بود" };
  } catch (error) {
    console.error("Payment Verification Failed:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown payment error",
    };
  }
}

export async function inquireTransaction(authority) {
  try {
    const inquiryResult = await zarinpal.inquiries.inquire({ authority });
    return { success: true, data: inquiryResult?.data };
  } catch (error) {
    console.error("Error during inquiry:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown payment error",
    };
  }
}
