"use server";

import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeAmazonProduct(url) {
  try {
    if (!url) {
      throw new Error("URL is required");
    }

    if (!url.includes("amazon.") && !url.includes("amazon.com")) {
      throw new Error("Invalid Amazon URL");
    }

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
      timeout: 30000,
    });

    const $ = cheerio.load(response.data);

    const productData = {
      productTitle: $("#productTitle").text().trim() || "Not found",
      priceSymbol: $(".a-price-symbol").first().text().trim() || "Not found",
      priceWhole: $(".a-price-whole").first().text().trim() || "Not found",
      priceFraction:
        $(".a-price-fraction").first().text().trim() || "Not found",
      fullPrice: null,
      beforeDiscountPrice: null,
      beforeDiscountSymbol: null,
      beforeDiscountWhole: null,
      beforeDiscountFraction: null,
      discountPercentage: null,
      mainImage: null,
      mainImageHighRes: null,
      images: [],
      productDetails: {},
      detailBullets: {},
      url: url,
      scrapedAt: new Date().toISOString(),
      success: true,
    };

    // ============================================================
    // 1. EXTRACT CURRENT PRICE
    // ============================================================
    // Combine price parts
    if (
      productData.priceSymbol !== "Not found" ||
      productData.priceWhole !== "Not found" ||
      productData.priceFraction !== "Not found"
    ) {
      productData.fullPrice = `${productData.priceSymbol}${productData.priceWhole}.${productData.priceFraction}`;
    } else {
      // Fallback: try alternative price selector
      const altPrice = $(".a-price .a-offscreen").first().text().trim();
      if (altPrice) {
        productData.fullPrice = altPrice;
        productData.priceSymbol = altPrice.match(/[^\d.]/)?.[0] || "Not found";
        const numbers = altPrice.match(/\d+/g);
        if (numbers) {
          productData.priceWhole = numbers[0] || "Not found";
          productData.priceFraction = numbers[1] || "Not found";
        }
      }
    }

    // ============================================================
    // 2. EXTRACT BEFORE DISCOUNT PRICE (Original Price)
    // ============================================================
    // Method 1: Using apex-basisprice-value class
    const basisPriceElement = $(".apex-basisprice-value").first();
    if (basisPriceElement.length) {
      let basisPriceText = basisPriceElement.text().trim();

      const priceSpan = basisPriceElement.find(".a-price").first();
      if (priceSpan.length) {
        const symbol = priceSpan.find(".a-price-symbol").first().text().trim();
        const whole = priceSpan.find(".a-price-whole").first().text().trim();
        const fraction = priceSpan
          .find(".a-price-fraction")
          .first()
          .text()
          .trim();

        if (symbol && whole && fraction) {
          productData.beforeDiscountSymbol = symbol;
          productData.beforeDiscountWhole = whole;
          productData.beforeDiscountFraction = fraction;
          productData.beforeDiscountPrice = `${symbol}${whole}.${fraction}`;
        } else {
          basisPriceText = basisPriceElement.text().trim();
          const priceMatch = basisPriceText.match(/([\d,]+\.?\d*)/);
          if (priceMatch) {
            productData.beforeDiscountPrice = basisPriceText;
          }
        }
      } else {
        const priceMatch = basisPriceText.match(/([\d,]+\.?\d*)/);
        if (priceMatch) {
          productData.beforeDiscountPrice = basisPriceText;
          const symbolMatch = basisPriceText.match(/[^\d,.\s]+/);
          if (symbolMatch) {
            productData.beforeDiscountSymbol = symbolMatch[0];
          }
        }
      }
    } else {
      // Method 2: Try .a-price .a-text-strike (strikethrough price)
      const strikePrice = $(".a-price .a-text-strike").first();
      if (strikePrice.length) {
        const symbol = strikePrice
          .find(".a-price-symbol")
          .first()
          .text()
          .trim();
        const whole = strikePrice.find(".a-price-whole").first().text().trim();
        const fraction = strikePrice
          .find(".a-price-fraction")
          .first()
          .text()
          .trim();

        if (symbol && whole && fraction) {
          productData.beforeDiscountSymbol = symbol;
          productData.beforeDiscountWhole = whole;
          productData.beforeDiscountFraction = fraction;
          productData.beforeDiscountPrice = `${symbol}${whole}.${fraction}`;
        } else {
          const offscreen = strikePrice
            .find(".a-offscreen")
            .first()
            .text()
            .trim();
          if (offscreen) {
            productData.beforeDiscountPrice = offscreen;
          }
        }
      }

      // Method 3: Try .a-price .a-text-price (text price)
      if (!productData.beforeDiscountPrice) {
        const textPrice = $(".a-price .a-text-price").first();
        if (textPrice.length) {
          const priceText = textPrice.text().trim();
          if (priceText) {
            productData.beforeDiscountPrice = priceText;
          }
        }
      }

      // Method 4: Try .priceBlockStrikePriceString
      if (!productData.beforeDiscountPrice) {
        const strikeString = $(".priceBlockStrikePriceString").first();
        if (strikeString.length) {
          const priceText = strikeString.text().trim();
          if (priceText) {
            productData.beforeDiscountPrice = priceText;
          }
        }
      }

      // Method 5: Try .a-size-large .a-color-price (alternate)
      if (!productData.beforeDiscountPrice) {
        const altPrice = $(".a-size-large.a-color-price").first();
        if (altPrice.length) {
          const priceText = altPrice.text().trim();
          if (priceText && priceText !== productData.fullPrice) {
            productData.beforeDiscountPrice = priceText;
          }
        }
      }
    }

    // ============================================================
    // 3. CALCULATE DISCOUNT PERCENTAGE
    // ============================================================
    if (productData.beforeDiscountPrice && productData.fullPrice) {
      const currentNum = parseFloat(
        productData.fullPrice.replace(/[^0-9.]/g, ""),
      );
      const beforeNum = parseFloat(
        productData.beforeDiscountPrice.replace(/[^0-9.]/g, ""),
      );

      if (
        !isNaN(currentNum) &&
        !isNaN(beforeNum) &&
        beforeNum > 0 &&
        beforeNum > currentNum
      ) {
        const discount = ((beforeNum - currentNum) / beforeNum) * 100;
        productData.discountPercentage = Math.round(discount * 100) / 100;
      }
    }

    // ============================================================
    // 4. EXTRACT DETAIL BULLETS (detailBulletsWrapper_feature_div)
    // ============================================================
    const detailBulletsWrapper = $("#detailBulletsWrapper_feature_div");

    if (detailBulletsWrapper.length) {
      // Method 1: Extract from list items
      detailBulletsWrapper
        .find("li, .a-list-item, .a-spacing-small")
        .each((index, element) => {
          const text = $(element).text().trim();
          if (text) {
            if (text.includes(":")) {
              const [label, ...valueParts] = text.split(":");
              const value = valueParts.join(":").trim();
              if (label && value) {
                productData.detailBullets[label.trim()] = value;
              }
            } else {
              productData.detailBullets[`Bullet ${index + 1}`] = text;
            }
          }
        });

      // Method 2: Extract from table-like structure
      detailBulletsWrapper.find(".a-row, .a-section").each((index, element) => {
        const text = $(element).text().trim();
        if (text && text.includes(":")) {
          const [label, ...valueParts] = text.split(":");
          const value = valueParts.join(":").trim();
          if (label && value && !productData.detailBullets[label.trim()]) {
            productData.detailBullets[label.trim()] = value;
          }
        }
      });

      // Method 3: Extract from specific detail bullet format
      detailBulletsWrapper
        .find(".a-text-bold, .a-size-base, .a-size-small")
        .each((index, element) => {
          const text = $(element).text().trim();
          if (text && text.includes(":")) {
            const [label, ...valueParts] = text.split(":");
            const value = valueParts.join(":").trim();
            if (label && value && !productData.detailBullets[label.trim()]) {
              productData.detailBullets[label.trim()] = value;
            }
          }
        });
    }

    // ============================================================
    // 5. EXTRACT MAIN IMAGE FROM main-image-container
    // ============================================================
    const mainImageContainer = $("#main-image-container");

    if (mainImageContainer.length) {
      const imgElement = mainImageContainer.find("img").first();
      if (imgElement.length) {
        let imgSrc = imgElement.attr("src");
        const dataOldHires = imgElement.attr("data-old-hires");
        const dataZoom = imgElement.attr("data-zoom");
        const dataDynamicImage = imgElement.attr("data-a-dynamic-image");

        if (dataOldHires) {
          productData.mainImageHighRes = dataOldHires;
          productData.mainImage = dataOldHires;
        } else if (dataZoom) {
          productData.mainImageHighRes = dataZoom;
          productData.mainImage = dataZoom;
        } else if (dataDynamicImage) {
          try {
            const imagesObj = JSON.parse(dataDynamicImage);
            let highestRes = null;
            let maxArea = 0;

            for (const [url, dimensions] of Object.entries(imagesObj)) {
              const area = dimensions[0] * dimensions[1];
              if (area > maxArea) {
                maxArea = area;
                highestRes = url;
              }
            }

            productData.mainImageHighRes = highestRes;
            productData.mainImage = highestRes;
          } catch (e) {
            productData.mainImage = imgSrc;
          }
        } else if (imgSrc) {
          let highResUrl = imgSrc;

          if (imgSrc.includes("_AC_")) {
            highResUrl = imgSrc.replace(/_AC_/g, "_SL1500_");
          } else if (imgSrc.includes("_SX")) {
            highResUrl = imgSrc.replace(/_SX\d+_/g, "_SL1500_");
          } else if (imgSrc.includes("_SY")) {
            highResUrl = imgSrc.replace(/_SY\d+_/g, "_SL1500_");
          } else if (imgSrc.includes("_SS")) {
            highResUrl = imgSrc.replace(/_SS\d+_/g, "_SL1500_");
          }

          productData.mainImage = imgSrc;
          productData.mainImageHighRes = highResUrl;
        }
      }
    } else {
      const landingImage = $("#landingImage");
      if (landingImage.length) {
        const src = landingImage.attr("src");
        const dataOldHires = landingImage.attr("data-old-hires");
        productData.mainImage = dataOldHires || src;
        productData.mainImageHighRes = dataOldHires || src;
      }
    }

    // ============================================================
    // 6. EXTRACT ALL IMAGES (including thumbnails)
    // ============================================================
    $('img[aria-label="Image thumbnails"]').each((index, element) => {
      const imgSrc = $(element).attr("src");
      if (imgSrc) {
        let highResSrc = imgSrc;
        if (imgSrc.includes("_AC_")) {
          highResSrc = imgSrc.replace(/_AC_/g, "_SL1500_");
        } else if (imgSrc.includes("_SX")) {
          highResSrc = imgSrc.replace(/_SX\d+_/g, "_SL1500_");
        }

        productData.images.push({
          src: imgSrc,
          highRes: highResSrc,
          alt: $(element).attr("alt") || "Product image",
          type: "thumbnail",
          index: productData.images.length,
        });
      }
    });

    $(
      "#imgTagWrapperId img, .a-dynamic-image, .imageThumbnail img, .a-carousel img[src*='images']",
    ).each((index, element) => {
      const imgSrc =
        $(element).attr("src") ||
        $(element).attr("data-old-hires") ||
        $(element).attr("data-a-dynamic-image");

      if (imgSrc && !productData.images.some((img) => img.src === imgSrc)) {
        if (imgSrc.startsWith("{")) {
          try {
            const imagesObj = JSON.parse(imgSrc);
            for (const [url, dimensions] of Object.entries(imagesObj)) {
              if (!productData.images.some((img) => img.src === url)) {
                let highResUrl = url;
                if (url.includes("_AC_")) {
                  highResUrl = url.replace(/_AC_/g, "_SL1500_");
                }

                productData.images.push({
                  src: url,
                  highRes: highResUrl,
                  alt: $(element).attr("alt") || "Product image",
                  dimensions: dimensions,
                  type: "dynamic",
                  index: productData.images.length,
                });
              }
            }
          } catch (e) {
            // Not JSON, skip
          }
        } else {
          let highResSrc = imgSrc;
          if (imgSrc.includes("_AC_")) {
            highResSrc = imgSrc.replace(/_AC_/g, "_SL1500_");
          } else if (imgSrc.includes("_SX")) {
            highResSrc = imgSrc.replace(/_SX\d+_/g, "_SL1500_");
          }

          productData.images.push({
            src: imgSrc,
            highRes: highResSrc,
            alt: $(element).attr("alt") || "Product image",
            type: "gallery",
            index: productData.images.length,
          });
        }
      }
    });

    $(".a-carousel img, .thumb-image, .thumbnail img, .imgTagWrapper img").each(
      (index, element) => {
        const imgSrc =
          $(element).attr("src") || $(element).attr("data-old-hires");
        if (imgSrc && !productData.images.some((img) => img.src === imgSrc)) {
          let highResSrc = imgSrc;
          if (imgSrc.includes("_AC_")) {
            highResSrc = imgSrc.replace(/_AC_/g, "_SL1500_");
          }

          productData.images.push({
            src: imgSrc,
            highRes: highResSrc,
            alt: $(element).attr("alt") || "Product image",
            type: "carousel",
            index: productData.images.length,
          });
        }
      },
    );

    // ============================================================
    // 7. EXTRACT PRODUCT DETAILS FROM prodDetails
    // ============================================================
    $(
      "#prodDetails table, #prodDetails .a-keyvalue, #productDetails_detailBullets_sections1 .a-keyvalue",
    ).each((index, table) => {
      $(table)
        .find("tr, .a-row")
        .each((rowIndex, row) => {
          const label = $(row)
            .find("th, .a-label, .a-text-bold, .a-size-base")
            .first()
            .text()
            .trim();
          const value = $(row)
            .find("td, .a-value, .a-size-base")
            .last()
            .text()
            .trim();

          if (label && value && label !== value) {
            productData.productDetails[label] = value;
          }
        });
    });

    // Alternative: Extract from feature bullets
    if (Object.keys(productData.productDetails).length === 0) {
      $("#feature-bullets .a-list-item, #productDescription .a-list-item").each(
        (index, element) => {
          const text = $(element).text().trim();
          if (text && text.length > 10) {
            productData.productDetails[`Feature ${index + 1}`] = text;
          }
        },
      );
    }

    // Extract from prodDetails sections
    $("#prodDetails .a-section .a-row").each((index, element) => {
      const text = $(element).text().trim();
      if (text && text.includes(":")) {
        const [label, ...valueParts] = text.split(":");
        const value = valueParts.join(":").trim();
        if (label && value && !productData.productDetails[label.trim()]) {
          productData.productDetails[label.trim()] = value;
        }
      }
    });

    // Remove duplicates from images
    const seen = new Set();
    productData.images = productData.images.filter((img) => {
      const key = img.src;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (!productData.mainImage && productData.images.length > 0) {
      productData.mainImage = productData.images[0].src;
      productData.mainImageHighRes =
        productData.images[0].highRes || productData.images[0].src;
    }

    return productData;
  } catch (error) {
    console.error("Error scraping Amazon product:", error.message);
    return {
      success: false,
      error: error.message,
      url: url,
      scrapedAt: new Date().toISOString(),
    };
  }
}

export async function scrapeAmazonProductQWEN(url) {
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

    // 1. EXTRACT ALL PRODUCT INFO & IMAGES
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
    $("#prodDetails .a-keyvalue tr, #prodDetails .a-row").each((i, el) => {
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

    // 2. EXTRACT PRICES (STRICTLY NUMERIC)
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

    // 4. RETURN DATA AS RESPONSE
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
