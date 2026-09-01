import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./src/generated/prisma/client.js";
import { config } from "dotenv";
config();
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const cats = await prisma.category.findMany({ select: { slug: true } });
console.log("categories:", cats.length, JSON.stringify(cats.slice(0,4)));
process.exit(0);
