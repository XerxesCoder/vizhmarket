export const ALLOWED_DOMAINS = ["amazon.ae", "shein.com", "noon.com"];
export const RATE_TO_TOMAN = 55000;

export const calculateFinalPrice = (
  basePriceAed,
  profitPercentage,
  shippingCostAed,
) => {
  const profitAmountAed = Number(
    (basePriceAed * (profitPercentage / 100)).toFixed(2),
  );

  const finalPriceAed = Number(
    (basePriceAed + profitAmountAed + shippingCostAed).toFixed(2),
  );

  return {
    basePriceAed,
    profitAmountAed,
    shippingCostAed,
    finalPriceAed,
    formattedBaseToman: formatToman(basePriceAed),
    formattedProfitToman: formatToman(profitAmountAed),
    formattedShippingToman: formatToman(shippingCostAed),
    formattedFinalToman: formatToman(finalPriceAed),
  };
};
export const isValidDetail = (value) => {
  if (typeof value !== "string") return false;
  const cleanVal = value.trim();
  return (
    cleanVal.length < 150 &&
    !cleanVal.includes("var ") &&
    !cleanVal.includes("function") &&
    !cleanVal.includes("P.when") &&
    !cleanVal.includes("ue.count")
  );
};

export const formatToman = (price) => {
  const toman = price * RATE_TO_TOMAN;
  return new Intl.NumberFormat("fa-IR").format(toman);
};

export const isValidDomain = (url) => {
  try {
    const parsed = new URL(url);
    return ALLOWED_DOMAINS.some((domain) => parsed.hostname.endsWith(domain));
  } catch {
    return false;
  }
};

export const getStoreName = (url) => {
  if (url.includes("amazon.ae")) return "آمازون امارات";
  if (url.includes("shein.com")) return "شئین (Shein)";
  if (url.includes("noon.com")) return "نون (Noon)";
  return "فروشگاه نامشخص";
};

export const getCurrency = (url) => {
  if (
    url.includes("amazon.ae") ||
    url.includes("noon.com") ||
    url.includes("shein.com")
  ) {
    return "درهم";
  }
  return "AED";
};
