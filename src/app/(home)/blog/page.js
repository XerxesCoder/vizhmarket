import Link from "next/link";
import { posts } from "@/lib/blog/posts";
import { buildMetadata, breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({ title: "بلاگ | ویژ مارکت", description: "مقالات و راهنمای خرید از آمازون و ویژ مارکت.", path: "/blog" });

export default function BlogPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "خانه", path: "/" }, { name: "بلاگ", path: "/blog" }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd({ name: "بلاگ ویژ مارکت", description: "مقالات ویژ مارکت", path: "/blog" })) }} />
      <h1 className="text-2xl font-black tracking-tight">بلاگ ویژ مارکت</h1>
      <p className="mt-2 text-sm text-muted-foreground">برای افزودن مطلب: یک آیتم به src/lib/blog/posts.js اضافه کنید و پوشه src/app/(home)/blog/&lt;slug&gt;/page.js را کپی کنید.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="overflow-hidden rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-sm transition-all">
            <img src={p.cover} alt={p.title} width={600} height={340} className="h-44 w-full object-cover" />
            <div className="p-5">
              <h2 className="font-bold leading-6">{p.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-2">{p.description}</p>
              <span className="mt-3 inline-flex text-xs text-muted-foreground">{p.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
