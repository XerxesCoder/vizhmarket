import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getNavCategories } from "@/lib/data/web-store";

export default async function HomeLayout({ children }) {
  const categories = await getNavCategories();

  return (
    <div className="flex min-h-dvh flex-col">
      <Link
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:right-2 focus:z-[60] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        پرش به محتوای اصلی
      </Link>
      <Header categories={categories} />
      <main id="main" className="flex-1 scroll-mt-20">
        {children}
      </main>
      <Footer categories={categories} />
    </div>
  );
}
