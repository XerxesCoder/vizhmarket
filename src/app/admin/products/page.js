import ProductManager from "@/components/admin/product-manager";
import { getAdminProducts, getExchangeRate } from "@/lib/data/admin-store";

export const metadata = { title: "مدیریت محصولات | ویژ مارکت" };

export default async function AdminProductsPage() {
  const [{ products, categories }, rate] = await Promise.all([getAdminProducts(), getExchangeRate()]);
  return <ProductManager products={products} categories={categories} aedRate={rate} />;
}
