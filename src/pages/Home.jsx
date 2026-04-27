import { useEffect, useState } from "react";
import { fetchCryptos } from "../api/coinGecko"; // API function to get top 100 coins
import { CryptoCard } from "../components/CryptoCard"; // Individual coin card component

export const Home = () => {
  const [cryptoList, setCryptoList] = useState([]); // Raw data from API (all 100 coins)
  const [filteredList, setFilteredList] = useState([]); // Filtered + sorted version for display
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial fetch
  const [viewMode, setViewMode] = useState("grid"); // Toggle: "grid" or "list" layout
  const [sortBy, setSortBy] = useState("market_cap_rank"); // Current sort criteria
  const [searchQuery, setSearchQuery] = useState(""); // Search input value

  // Polling: re-fetches data every 30 seconds (auto-update prices)
  useEffect(() => {

    fetchCryptoData(); // Initial fetch immediately
    const interval = setInterval(fetchCryptoData, 30000);

    return () => clearInterval(interval);
  }, []);

  // Re-runs filter/sort whenever these dependencies change
  useEffect(() => {
    filterAndSort();
  }, [sortBy, cryptoList, searchQuery]); // Any change triggers re-processing

  // Fetches crypto data from CoinGecko API
  const fetchCryptoData = async () => {
    try {
      const data = await fetchCryptos(); // API call
      setCryptoList(data); // Store raw data
    } catch (error) {
      console.error("Error fetching crypto: ", error);
    } finally {
      setIsLoading(false); // Always stop loading spinner
    }
  };

  // Filters by search query AND sorts by selected criteria
  const filterAndSort = () => {
    // Filter: matches name or symbol (case insensitive)
    let filtered = cryptoList.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort: uses switch to handle different sort criteria
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name); // Alphabetical (uses localeCompare for proper string sort)
        case "price":
          return a.current_price - b.current_price; // Low to high
        case "price_desc":
          return b.current_price - a.current_price; // High to low (reversed)
        case "change":
          return a.price_change_percentage_24h - b.price_change_percentage_24h; // 24h change
        case "market_cap":
          return a.market_cap - b.market_cap; // By market cap
        default:
          return a.market_cap_rank - b.market_cap_rank; // Default: by CoinGecko rank
      }
    });

    setFilteredList(filtered); // Update display list
  };

  return (
    <div className="app">

      {/* Header: logo + search bar */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🚀 Crypto Tracker</h1>
            <p>Real-time cryptocurrency prices and market data</p>
          </div>
          <div className="search-section">
            <input
              type="text"
              placeholder="Search cryptos..."
              className="search-input"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>
      </header>

      {/* Controls bar: sort dropdown + grid/list toggle */}
      <div className="controls">
        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="market_cap_rank">Rank</option>
            <option value="name">Name</option>
            <option value="price">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
            <option value="change">24h Change</option>
            <option value="market_cap">Market Cap</option>
          </select>
        </div>
        <div className="view-toggle">
          {/* Grid/List toggle buttons - highlights active mode */}
          <button
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => setViewMode("grid")}
          >
            Grid
          </button>
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
          >
            List
          </button>
        </div>
      </div>

      {/* Conditional rendering: loading spinner OR crypto cards */}
      {isLoading ? (
        <div className="loading">
          <div className="spinner" />
          <p>Loading crypto data...</p>
        </div>
      ) : (
        <div className={`crypto-container ${viewMode}`}>
          {filteredList.map((crypto, key) => (
            <CryptoCard crypto={crypto} key={key} />
          ))}
        </div>
      )}

      {/* Footer: data attribution + update frequency */}
      <footer className="footer">
        <p>Data provided by CoinGecko API • Updated every 30 seconds</p>
      </footer>
    </div>
  );
};
