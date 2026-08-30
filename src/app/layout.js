import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { DirectionProvider } from "@/components/ui/direction";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const Vazir = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic"],
  weight: ["600", "900"],
});

export const metadata = {
  title: "ویژ مارکت | فروشگاه اینترنتی با ارسال یک روزه",
  description:
    "خرید آنلاین محصولات دیجیتال، مد و پوشاک با تخفیف‌های انفجاری و ارسال اکسپرس در ویژ مارکت",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${Vazir.variable}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <DirectionProvider direction="rtl">
            <TooltipProvider>{children}</TooltipProvider>
          </DirectionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
