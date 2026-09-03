import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function slugify(s) { return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-"); }

const childCats = await prisma.category.findMany({ where: { parentId: { not: null } } });
if (childCats.length === 0) { console.log("No child categories found"); process.exit(0); }

const brands = ["نایک", "آدیداس", "پوما", "زارا", "اچ‌اندام"];
for (const cat of childCats) {
  for (let i = 1; i <= 10; i++) {
    const title = `${cat.name} مدل ${i}`;
    const slug = slugify(`${cat.slug}-${i}-${Date.now().toString().slice(-4)}`);
    const sku = `SKU-${slug}`;
    try {
      const product = await prisma.product.create({
        data: {
          title, slug, sku,
          brand: brands[i % brands.length],
          description: `توضیحات محصول ${title} در دسته ${cat.name}`,
          images: [`/assets/products/${cat.slug}-${i}.jpg`],
          specs: [`وزن: ${(200 + i * 10)} گرم`, `جنس: چرم مصنوعی`],
          isActive: true,
          isExpress: i % 3 === 0,
          categoryId: cat.id,
          totalSold: Math.floor(Math.random() * 100),
        },
      });
      // 2 variants per product
      for (let v = 0; v < 2; v++) {
        const colors = ["قرمز", "آبی"];
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sku: `${sku}-${String(v + 1).padStart(2, "0")}`,
            images: [],
            aedPrice: 100 + v * 20,
            irrPrice: 2000000 + v * 500000,
            stock: 10 + v * 5,
            isDefault: v === 0,
            attributes: { create: [{ key: "رنگ", value: colors[v] }] },
          },
        });
      }
      console.log(`Created ${title}`);
    } catch (e) {
      console.error(`Failed ${slug}:`, e.message);
    }
  }
}
await prisma.$disconnect();
console.log("Done");
