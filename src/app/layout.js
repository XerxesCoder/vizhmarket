import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { DirectionProvider } from "@/components/ui/direction";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE_URL, SITE_NAME, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const Vazir = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic"],
  weight: ["600", "900"],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | فروشگاه اینترنتی با ارسال یک روزه`, template: `%s | ${SITE_NAME}` },
  description: "خرید آنلاین محصولات دیجیتال، مد و پوشاک با تخفیف‌های انفجاری و ارسال اکسپرس در ویژ مارکت",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} | فروشگاه اینترنتی با ارسال یک روزه`,
    description: "خرید آنلاین محصولات دیجیتال، مد و پوشاک با تخفیف‌های انفجاری و ارسال اکسپرس در ویژ مارکت",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "fa_IR",
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: { card: "summary_large_image", title: `${SITE_NAME} | فروشگاه اینترنتی`, description: "خرید آنلاین با ارسال اکسپرس" },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }) {
  const org = organizationJsonLd();
  const site = websiteJsonLd();
  return (
    <html lang="fa" dir="rtl" className={`${Vazir.variable}  h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(site) }} />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <DirectionProvider direction="rtl">
            <TooltipProvider>{children}</TooltipProvider>
          </DirectionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
