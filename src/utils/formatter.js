// Formats cryptocurrency prices for display (USD)
export const formatPrice = (price) => {
  // Tiny prices (e.g., meme coins/SHIB): show 8 decimal places so it's not just "$0.00"
  if (price < 0.01) return price.toFixed(8);

  // Normal prices: use browser's built-in Intl API for proper currency formatting
  return new Intl.NumberFormat("en-US", {
    style: "currency", // Adds "$" symbol
    currency: "USD", // US Dollars
    minimumFractionDigits: 2, // Always shows cents (e.g., $45.00)
    maximumFractionDigits: 2, // Max 2 decimal places
  }).format(price);
};

// Formats large market cap numbers into human-readable abbreviations
export const formatMarketCap = (marketCap) => {
  if (marketCap >= 1e12) return `${(marketCap / 1e12).toFixed(2)}T`; // 1e12 = 1 trillion (1,000,000,000,000)
  if (marketCap >= 1e9) return `${(marketCap / 1e9).toFixed(2)}B`; // 1e9 = 1 billion
  if (marketCap >= 1e6) return `${(marketCap / 1e6).toFixed(2)}M`; // 1e6 = 1 million
  return marketCap.toLocaleString(); // Under 1 million: just show with commas (e.g., "850,000")
};
