import PaymentResult from "@/components/cart/payment-result";
import { getOrderByAuthority } from "@/lib/actions/order-actions";

export const metadata = { title: "نتیجه پرداخت | ویژ مارکت" };

export default async function CheckoutResultPage({ searchParams }) {
  const params = await searchParams;

  const order = params?.auth ? await getOrderByAuthority(params.auth) : null;

  return (
    <PaymentResult
      status={params?.status}
      auth={params?.auth}
      reason={params?.reason}
      order={order}
    />
  );
}
