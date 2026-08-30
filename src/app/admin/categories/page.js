import CategoryManager from "@/components/admin/category-manager";
import { getAdminCategories } from "@/lib/data/admin-store";

export const metadata = { title: "مدیریت دسته‌بندی‌ها | ویژ مارکت" };

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();
  return <CategoryManager categories={categories} />;
}
