import AdminSidebar from "@/components/admin/admin-sidebar";

export const metadata = { title: "پنل مدیریت | ویژ مارکت" };

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
