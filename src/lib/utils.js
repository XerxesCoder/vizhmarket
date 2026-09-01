import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getCurrentPersianYear() {
  return new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(
    new Date(),
  );
}

export function toPersianDigits(text) {
  if (!text) return text;

  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  return text.toString().replace(/\d/g, (digit) => {
    return persianDigits[parseInt(digit)];
  });
}

export const baseUrl =
  process.env.NODE_ENV !== "development"
    ? `https://kobehlock.ir`
    : "http://localhost:3000";
