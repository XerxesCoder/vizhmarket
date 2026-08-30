import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";

// trail: [{ label, href }, ...] — every level is clickable
export function Breadcrumb({ trail = [], current }) {
  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 lg:px-8 pt-8">
      <nav className="flex items-center flex-wrap gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          خانه
        </Link>
        <IconChevronLeft size={14} />
        <Link href="/store" className="hover:text-foreground transition-colors">
          فروشگاه
        </Link>
        {trail.map((item) => (
          <span key={item.href} className="flex items-center gap-1.5">
            <IconChevronLeft size={14} />
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          </span>
        ))}
        <IconChevronLeft size={14} />
        <span className="text-foreground font-medium truncate max-w-56">{current}</span>
      </nav>
    </div>
  );
}
