import { ZarinPal } from "zarinpal-node-sdk";

export const zarinpal = new ZarinPal({
  merchantId: process.env.ZARINPAL_MERCHANT,
  sandbox: process.env.NODE_ENV === "development",
  accessToken: process.env.ZARINPAL_TOKEN || "",
});
