export const getCurrencySymbol = (currency?: string | null): string => {
  const symbols: { [key: string]: string } = {
    INR: "₹",
    USD: "$",
    BDT: "৳",
    EUR: "€",
    GBP: "£"
  };
  return symbols[currency || "INR"] || "$";
};

export const formatPrice = (price: string | number, currency?: string | null): string => {
  const symbol = getCurrencySymbol(currency || "INR");
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return `${symbol}${numPrice.toLocaleString()}`;
};