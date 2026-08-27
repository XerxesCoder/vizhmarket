"use server";

import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeAmazonProduct(url) {
  if (!url || !url.startsWith("http")) {
    return { success: false, error: "آدرس URL معتبر نیست." };
  }

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const productTitle = $("#productTitle").text().trim() || "Not found";

    const images = [];
    const mainImg =
      $("#landingImage").attr("src") ||
      $("#main-image-container img").first().attr("src");

    if (mainImg) {
      images.push({ type: "main", url: mainImg });
    }

    $(
      "#altImages img, .a-dynamic-image, .imageThumbnail img, .a-carousel img",
    ).each((i, el) => {
      const src = $(el).attr("src") || $(el).attr("data-old-hires");
      if (src && !images.some((img) => img.url === src)) {
        images.push({ type: "gallery", url: src });
      }
    });

    const productDetails = {};
    $(
      "#prodDetails .a-keyvalue tr, #prodDetails .a-row, #productDescription",
    ).each((i, el) => {
      const key = $(el)
        .find("th, .a-span3, .a-text-bold")
        .first()
        .text()
        .trim();
      const value = $(el)
        .find("td, .a-span9, .a-size-base")
        .last()
        .text()
        .trim();
      if (key && value && key !== value) {
        productDetails[key] = value;
      }
    });

    const detailBullets = [];
    $("#feature-bullets .a-list-item").each((i, el) => {
      const text = $(el).text().trim();
      if (text) detailBullets.push(text);
    });

    const priceWholeRaw = $(".a-price-whole").first().text().trim();
    const priceFractionRaw = $(".a-price-fraction").first().text().trim();

    let currentPrice = null;
    if (priceWholeRaw) {
      const whole = priceWholeRaw.replace(/[^0-9]/g, "");
      const fraction = priceFractionRaw
        ? priceFractionRaw.replace(/[^0-9]/g, "")
        : "00";
      currentPrice = parseFloat(`${whole}.${fraction}`);
    } else {
      const altPriceText = $(".a-price .a-offscreen").first().text().trim();
      const match = altPriceText.match(/[\d,]+\.?\d*/);
      if (match) {
        currentPrice = parseFloat(match[0].replace(/,/g, ""));
      }
    }

    let beforeDiscountPrice = null;
    const strikeText = $(
      ".apex-basisprice-value, .a-price .a-text-strike, .a-price .a-text-price",
    )
      .first()
      .text()
      .trim();

    const strikeMatch = strikeText.match(/[\d,]+\.?\d*/);
    if (strikeMatch) {
      beforeDiscountPrice = parseFloat(strikeMatch[0].replace(/,/g, ""));
    }

    let discountPercentage = null;
    if (
      currentPrice !== null &&
      beforeDiscountPrice !== null &&
      beforeDiscountPrice > currentPrice
    ) {
      discountPercentage =
        Math.round(
          ((beforeDiscountPrice - currentPrice) / beforeDiscountPrice) * 10000,
        ) / 100;
    }

    const savedAmount =
      beforeDiscountPrice !== null && currentPrice !== null
        ? Number((beforeDiscountPrice - currentPrice).toFixed(2))
        : null;

    const fullProductData = {
      url,
      scrapedAt: new Date().toISOString(),
      productTitle,
      images,
      productDetails,
      detailBullets,
      pricing: {
        currentPrice,
        beforeDiscountPrice,
        discountPercentage,
        savedAmount,
      },
    };
    console.log(fullProductData);
    return {
      success: true,
      data: fullProductData,
    };
  } catch (error) {
    console.error("Error scraping Amazon product:", error.message);
    return {
      success: false,
      error: error.message || "خطا در استخراج اطلاعات محصول",
    };
  }
}
