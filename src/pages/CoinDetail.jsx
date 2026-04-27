// useParams gets :id from URL, useNavigate for back button
import { useNavigate, useParams } from "react-router";
// API functions for coin detail + chart
import { fetchChartData, fetchCoinData } from "../api/coinGecko";
import { useEffect, useState } from "react";
import { formatMarketCap, formatPrice } from "../utils/formatter"; // Formatting utilities

// Recharts: charting library for React
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const CoinDetail = () => {
  const { id } = useParams(); // Extracts coin id from URL

  const navigate = useNavigate(); // For programmatic navigation (back button)

  const [coin, setCoin] = useState(null); // Coin detail object from API
  const [chartData, setChartData] = useState([]); // Formatted array for recharts
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch data when id changes (user navigates between coins)
  useEffect(() => {
    loadCoinData();
    loadChartData();
  }, [id]); // Re-runs if id changes

  // Fetches coin metadata (name, price, market data, etc.)
  const loadCoinData = async () => {
    try {
      const data = await fetchCoinData(id); // API call with coin id
      setCoin(data); // Store full coin object
    } catch (error) {
      console.error("Error fetching coin", error);
    } finally {
      setIsLoading(false); // Stop spinner
    }
  };

  // Fetches 7-day price history and formats for recharts
  const loadChartData = async () => {
    try {
      const data = await fetchChartData(id);
      // Format raw data for recharts: needs {time, price} objects
      const formattedData = data.prices.map((price) => ({
        time: new Date(price[0]).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        price: price[1].toFixed(2), // Price with 2 decimal places
      }));

      setChartData(formattedData); // Store formatted array for LineChart
    } catch (error) {
      console.error("Error fetching coin", error);
    } finally {
      setIsLoading(false); // Stop spinner (runs even if loadCoinData already set it)
    }
  };

  // Loading state: full screen spinner
  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading coin data...</p>
        </div>
      </div>
    );
  }

  // Coin not found state: show message + back button
  if (!coin) {
    return (
      <div className="app">
        <div className="no-results">
          <p>Coin not found</p>
          <button onClick={() => navigate("/")}>Go back</button>
        </div>
      </div>
    );
  }

  // Extract 24h change for conditional styling
  const priceChange = coin.market_data.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="app">
      {/* Header: same as Home page + back button */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🚀 Crypto Tracker</h1>
            <p>Real-time cryptocurrency prices and market data</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="back-button"
          >
            ← Back to list
          </button>
        </div>
      </header>

      <div className="coin-detail">
        {/* Coin header: image, name, symbol, rank */}
        <div className="coin-header">
          <div className="coin-title">
            <img
              src={coin.image.large}
              alt={coin.name}
            />
            <div>
              <h1>{coin.name}</h1>
              <p className="symbol">{coin.symbol.toUpperCase()}</p>
            </div>
          </div>
          <span className="rank">Rank #{coin.market_data.market_cap_rank}</span>
        </div>

        {/* Price section: current price + 24h change badge */}
        <div className="coin-price-section">
          <div className="current-price">
            <h2>{formatPrice(coin.market_data.current_price.usd)}</h2>
            <span
              className={`change-badge ${isPositive ? "positive" : "negative"}`}
            >
              {isPositive ? "↑" : "↓"} {Math.abs(priceChange).toFixed(2)} %
            </span>
          </div>

          {/* 24h High/Low range */}
          <div className="price-ranges">
            <div className="price-range">
              <span className="range-label">24h High</span>
              <span className="range-value">
                {formatPrice(coin.market_data.high_24h.usd)}
              </span>
            </div>
            <div className="price-range">
              <span className="range-label">24h Low</span>
              <span className="range-value">
                {formatPrice(coin.market_data.low_24h.usd)}
              </span>
            </div>
          </div>
        </div>

        {/* Price chart section using recharts */}
        <div className="chart-section">
          <h3>Price Chart (7 Days)</h3>
          <ResponsiveContainer
            width="100%"
            height={400}
          >
            {" "}
            {/* Makes chart responsive */}
            <LineChart data={chartData}>
              {" "}
              {/* Passes formatted data array */}
              <CartesianGrid
                strokeDasharray="3 3" // Dashed grid lines
                stroke="rgba(255, 255, 255, 0.1)" // Subtle white lines
              />
              <XAxis
                dataKey="time" // Matches "time" property in chartData objects
                stroke="#9ca3af" // Gray axis line
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
                domain={["auto", "auto"]} // Auto-calculate min/max
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(20, 20, 40, 0.95)", // Dark semi-transparent background
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "#e0e0e0", // Light text
                }}
              />
              <Line
                type="monotone" // Smooth curved line
                dataKey="price" // Matches "price" property in chartData objects
                stroke="#ADD8E6" // Light blue line
                strokeWidth={2} // Line thickness
                dot={false} // Hide dots on data points (cleaner look)
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stats grid: 4 cards with market data */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Market Cap</span>
            <span className="stat-value">
              ${formatMarketCap(coin.market_data.market_cap.usd)}
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Volume (24)</span>
            <span className="stat-vlaue">
              ${formatMarketCap(coin.market_data.total_volume.usd)}
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Circulating Supply</span>
            <span className="stat-vlaue">
              {coin.market_data.circulating_supply?.toLocaleString() || "N/A"}
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Total Supply</span>
            <span className="stat-vlaue">
              {coin.market_data.total_supply?.toLocaleString() || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Footer: same as Home page */}
      <footer className="footer">
        <p>Data provided by CoinGecko API • Updated every 30 seconds</p>
      </footer>
    </div>
  );
};
