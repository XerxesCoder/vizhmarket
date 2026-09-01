import { Suspense } from "react";
import { redirect } from "next/navigation";
import ProfileTabs from "@/components/profile/profile-tabs";
import { getCurrentUser } from "@/lib/auth";
import { getUserOrders } from "@/lib/data/profile-store";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "پروفایل | ویژ مارکت" };

function ProfileSkeleton() {
  return (
    <div dir="rtl" className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
      <Skeleton className="h-9 w-48 mb-6" />
      <Skeleton className="h-10 w-72 mb-6 rounded-xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}

async function ProfileContent() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { storeOrders, webOrders } = await getUserOrders(user.id);

  return (
    <ProfileTabs user={user} storeOrders={storeOrders} webOrders={webOrders} />
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}
