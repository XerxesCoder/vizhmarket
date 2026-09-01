//import { baseUrl } from "@/lib/utils";
const baseUrl = "https://vizhmarket.ir";
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api",
        "/admin",
        "/profile",
        "/order",
        "/login",
        "/cart",
        "/checkout",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
