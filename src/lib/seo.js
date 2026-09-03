export const SITE_URL = "https://vizhmarket.ir";
export const SITE_NAME = "ویژ مارکت";

export function buildMetadata({ title, description, path = "/", image, noIndex = false }) {
  const url = `${SITE_URL}${path}`;
  const ogImage = image ? (image.startsWith("http") ? image : `${SITE_URL}${image}`) : `${SITE_URL}/og-image.jpg`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "fa_IR",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
  };
}
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "fa-IR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/store?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}
export function productJsonLd(product) {
  const variant = product.variants?.[0];
  const price = variant?.irrPrice ?? variant?.aedPrice ?? 0;
  const inStock = (variant?.stock ?? 0) > 0;
  const images = [...(product.images || []), ...(variant?.images || [])].slice(0, 4).map((u) => (u.startsWith("http") ? u : `${SITE_URL}${u}`));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.title,
    sku: product.sku,
    image: images.length ? images : undefined,
    brand: { "@type": "Brand", name: product.brand || SITE_NAME },
    aggregateRating: product.totalSold > 0 ? { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: String(product.totalSold) } : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "IRR",
      price: String(price),
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/store/${product.category?.slug}/${product.slug}`,
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };
}
export function itemListJsonLd(products, listName) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/store/${p.category?.slug}/${p.slug}`,
      name: p.title,
    })),
  };
}
export function blogPostingJsonLd(post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || post.excerpt || post.title,
    datePublished: post.date,
    author: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    image: post.cover ? `${SITE_URL}${post.cover}` : undefined,
    inLanguage: "fa-IR",
  };
}
export function collectionJsonLd({ name, description, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${SITE_URL}${path}`,
    inLanguage: "fa-IR",
  };
}
