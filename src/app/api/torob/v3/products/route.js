import { NextResponse } from "next/server";

import { importSPKI, jwtVerify } from "jose";
import { baseUrl } from "@/lib/utils";
import { getStoreData } from "@/lib/data/web-store";

const TOROB_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAt6Mu4T0pBORY11W+QeM35UsmLO3vsf+6yKpFDEImFk0=
-----END PUBLIC KEY-----`;

const PRODUCTS_PER_PAGE = 100;

function formatProduct(product) {
  const categoryName = product.category?.name || "دسته‌بندی نشده";

  const defaultVariant =
    product.variants.find((v) => v.isDefault) || product.variants[0];

  // Calculate total stock across all variants
  const totalQuantity = product.variants.reduce(
    (sum, variant) => sum + (variant.stock || 0),
    0,
  );
  const availability = totalQuantity > 0;

  // Price: Torob expects price in Toman.
  // NOTE: If your irrPrice is in Rial, divide by 10: Math.round((defaultVariant?.irrPrice || 0) / 10)
  const currentPrice = defaultVariant
    ? Math.round(defaultVariant.irrPrice || 0)
    : 0;

  // Image links: combine product images and default variant images
  const imageLinks = [];
  const addImage = (img) => {
    if (img) {
      const url = img.startsWith("http") ? img : `${baseUrl}/${img}`;
      if (!imageLinks.includes(url)) imageLinks.push(url);
    }
  };

  if (product.images && product.images.length > 0) {
    product.images.forEach(addImage);
  }
  if (defaultVariant?.images && defaultVariant.images.length > 0) {
    defaultVariant.images.forEach(addImage);
  }

  if (imageLinks.length === 0) {
    imageLinks.push(`${baseUrl}/assets/logo.png`); // Fallback image
  }

  // Build spec object from brand and variant attributes
  const spec = {};
  if (product.brand) {
    spec["برند"] = product.brand;
  }

  // Add attributes from the default variant as specifications
  if (defaultVariant?.attributes) {
    defaultVariant.attributes.forEach((attr) => {
      spec[attr.key] = attr.value;
    });
  }

  // Optional: Add custom logic based on category (adapted from your old smart lock logic)

  const pageUrl = `${baseUrl}/store/${product.category.slug}/${product.slug}`;

  const shortDesc = product.description
    ? product.description.substring(0, 150) +
      (product.description.length > 150 ? "..." : "")
    : `خرید ${product.title} با بهترین قیمت و گارانتی معتبر`;

  const productGuarantee = "گارانتی اصالت و سلامت فیزیکی کالا";

  return {
    page_unique: product.id,
    page_url: pageUrl,
    product_group_id: product.id,
    title: product.title,
    subtitle: product.brand
      ? `${product.brand} - ${product.title}`
      : product.title,
    current_price: currentPrice,
    availability: availability,
    category_name: categoryName,
    image_links: imageLinks,
    spec: spec,
    guarantee: productGuarantee,
    short_desc: shortDesc,
    date_added: product.createdAt?.toISOString(),
    date_updated: product.updatedAt?.toISOString(),
  };
}

async function verifyTorobToken(request, expectedHostname) {
  const token = request.headers.get("X-Torob-Token");
  const tokenVersion = request.headers.get("X-Torob-Token-Version");

  if (!token) {
    return { valid: false, message: "Missing X-Torob-Token header" };
  }

  if (tokenVersion !== "1") {
    return { valid: false, message: "Unsupported X-Torob-Token-Version" };
  }

  try {
    const publicKey = await importSPKI(TOROB_PUBLIC_KEY, "EdDSA");

    const { payload } = await jwtVerify(token, publicKey, {
      audience: expectedHostname,
    });

    return { valid: true, payload };
  } catch (error) {
    console.error("Token verification failed:", error);
    return { valid: false, error: "Token verification failed" };
  }
}

export async function POST(request) {
  const expectedHostname = baseUrl.split("//")[1];

  try {
    const isDevelopment = process.env.NODE_ENV === "development";

    if (!isDevelopment) {
      const auth = await verifyTorobToken(request, expectedHostname);
      if (!auth.valid) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
      }
    }

    const body = await request.json();

    const allProducts = await getStoreData();

    let products = [];
    let currentPage = 1;
    let total = allProducts?.products.length;
    console.log(allProducts.products[0].category);
    if (body.page_urls && Array.isArray(body.page_urls)) {
      products = allProducts?.products.filter((p) => {
        const url = `${baseUrl}/store/${p.category.slug}/${p.slug}`;
        return body.page_urls.includes(url);
      });
      total = products.length;
    } else if (body.page_uniques && Array.isArray(body.page_uniques)) {
      products = allProducts?.products.filter((p) =>
        body.page_uniques.includes(p.id.toString()),
      );

      total = products.length;
    } else if (body.page !== undefined) {
      currentPage = parseInt(body.page) || 1;
      const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
      const endIndex = startIndex + PRODUCTS_PER_PAGE;

      if (body.sort === "date_updated_desc") {
        allProducts?.products.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
        );
      } else {
        allProducts?.products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
      }

      products = allProducts?.products.slice(startIndex, endIndex);
    } else {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 },
      );
    }

    const formattedProducts = products.map(formatProduct);

    const maxPages = Math.ceil(total / PRODUCTS_PER_PAGE);

    return NextResponse.json({
      api_version: "torob_api_v3",
      current_page: currentPage,
      total: total,
      max_pages: maxPages,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Error in Torob API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
