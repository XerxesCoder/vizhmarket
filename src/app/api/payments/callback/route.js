// Zarinpal payment callback — called by Zarinpal after the user pays.
// Verifies the transaction and, on success, finalizes the order (finishOrder):
// sets status → PAID, saves zarinpalref, and only then consumes inventory/sold).
// Then redirects the user to a friendly result page..

import { NextResponse } from "next/server";
import { verifyZarinpalPayment } from "@/lib/actions/payments";

// Every callback is a fresh payment event (reads request URL → dynamic by nature).


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");

  if (!authority) {
    return NextResponse.redirect(new URL("/checkout/result?status=error", request.url));
  }

    if (status !== "OK") {
    return NextResponse.redirect(
      new URL(
        `/checkout/result?status=cancelled&auth=${encodeURIComponent(authority)}`,
        request.url,
      ),
    );
  }

  const result = await verifyZarinpalPayment(authority, status);

  const reason =
    typeof result?.error === "string"
      ? result.error
      : result?.error?.message ?? "خطای نامشخص";

  const statusParam = result?.success ? "success" : "error";

  // Authority is unique per order/payment — the result page fetches the whole
  // order by it (and offers "pay again" on failure). No other params needed.
  const target = `/checkout/result?status=${statusParam}&auth=${encodeURIComponent(authority)}${result?.success ? "" : `&reason=${encodeURIComponent(reason)}`}`;

  return NextResponse.redirect(new URL(target, request.url));
}