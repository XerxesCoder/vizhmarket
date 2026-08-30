import LandingPage from "@/components/Landing/Landing";
import { getLandingData, getNavCategories } from "@/lib/data/web-store";

export default async function Home() {
  const [{ sections, bestSellers }, categories] = await Promise.all([
    getLandingData(),
    getNavCategories(),
  ]);
  return (
    <div className="w-full">
      <LandingPage sections={sections} bestSellers={bestSellers} categories={categories} />
    </div>
  );
}
