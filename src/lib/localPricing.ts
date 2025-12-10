export const LOCAL_PRICES: Record<string, { amount: number; currency: string; symbol: string }> = {
  US: { amount: 9.99, currency: "USD", symbol: "$" },
  IN: { amount: 799, currency: "INR", symbol: "₹" },
  GB: { amount: 7.99, currency: "GBP", symbol: "£" },
  DE: { amount: 8.99, currency: "EUR", symbol: "€" },
  FR: { amount: 8.99, currency: "EUR", symbol: "€" },
  CA: { amount: 12.99, currency: "CAD", symbol: "$" },
  AU: { amount: 14.99, currency: "AUD", symbol: "$" },
  JP: { amount: 999, currency: "JPY", symbol: "¥" },
};

export const DEFAULT_PRICE = { amount: 9.99, currency: "USD", symbol: "$" };

export const COUNTRY_TO_CODE: Record<string, string> = {
  "United States": "US",
  "India": "IN",
  "United Kingdom": "GB",
  "Germany": "DE",
  "France": "FR",
  "Canada": "CA",
  "Australia": "AU",
  "Japan": "JP",
};
