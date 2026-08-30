import UserManager from "@/components/admin/user-manager";
import { getAdminUsers } from "@/lib/data/admin-store";

export const metadata = { title: "مدیریت کاربران | ویژ مارکت" };

export default async function AdminUsersPage() {
  const users = await getAdminUsers();
  return <UserManager users={users} />;
}
