import ProductManager from "@/components/admin/product-manager";
import { getAdminProducts } from "@/lib/data/admin-store";

export const metadata = { title: "مدیریت محصولات | ویژ مارکت" };

export default async function AdminProductsPage() {
  const { products, categories } = await getAdminProducts();
  return <ProductManager products={products} categories={categories} />;
}
