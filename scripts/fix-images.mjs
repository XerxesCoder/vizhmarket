import "dotenv/config";
import fs from "fs";
import path from "path";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const PLACEHOLDER = "https://placehold.co/600x400/red/white";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const OLD_PLACEHOLDER = "https://via.placeholder.com/600x600?text=No+Image";
function isUrl(p) { if (p === OLD_PLACEHOLDER || p.includes("via.placeholder.com")) return false; return /^(https?:)?\/\//.test(p) || /^data:/.test(p) || /^blob:/.test(p); }
function isValidLocal(p) {
  if (!p.startsWith("/")) return false;
  const file = path.join(process.cwd(), "public", p);
  return fs.existsSync(file);
}

const products = await prisma.product.findMany();
for (const pr of products) {
  const fixed = pr.images.map((img) => (isUrl(img) || isValidLocal(img) ? img : PLACEHOLDER));
  if (JSON.stringify(fixed) !== JSON.stringify(pr.images)) {
    await prisma.product.update({ where: { id: pr.id }, data: { images: fixed } });
    console.log(`Fixed product ${pr.slug}`);
  }
}
const variants = await prisma.productVariant.findMany();
for (const v of variants) {
  const fixed = v.images.map((img) => (isUrl(img) || isValidLocal(img) ? img : PLACEHOLDER));
  if (JSON.stringify(fixed) !== JSON.stringify(v.images)) {
    await prisma.productVariant.update({ where: { id: v.id }, data: { images: fixed } });
    console.log(`Fixed variant ${v.id}`);
  }
}
const cats = await prisma.category.findMany();
for (const c of cats) {
  if (c.image && !isUrl(c.image) && !isValidLocal(c.image)) {
    await prisma.category.update({ where: { id: c.id }, data: { image: PLACEHOLDER } });
    console.log(`Fixed category ${c.slug}`);
  }
}
await prisma.$disconnect();
console.log("Done");
