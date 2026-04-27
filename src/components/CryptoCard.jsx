import { Link } from "react-router";

// Custom formatting functions
import { formatMarketCap, formatPrice } from "../utils/formatter";

export const CryptoCard = ({ crypto }) => {
  return (

    // Entire card is a clickable link to coin detail page
    <Link to={`/coin/${crypto.id}`} style={{ textDecoration: "none" }}>
      <div className="crypto-card">

        {/* Header: coin image + name + symbol + rank */}
        <div className="crypto-header">
          <div className="crypto-info">
            <img src={crypto.image} alt={crypto.name} /> {/* Coin icon from API */}
            <div>
              <h3>{crypto.name}</h3>
              <p className="symbol">{crypto.symbol.toUpperCase()}</p>
              <span className="rank">#{crypto.market_cap_rank}</span>
            </div>
          </div>
        </div>

        {/* Price section: current price + 24h change */}
        <div className="crypto-price">
          <p className="price">{formatPrice(crypto.current_price)}</p> {/* Formatted USD price */}
          <p
            className={`change ${
              crypto.price_change_percentage_24h >= 0 ? "positive" : "negative" // Green for gains, red for losses
            }`}
          >
            {crypto.price_change_percentage_24h >= 0 ? "↑" : "↓"}{" "} {/* Arrow direction based on price movement */}
            {Math.abs(crypto.price_change_percentage_24h).toFixed(2)} %
          </p>
        </div>

        {/* Stats: market cap and 24h volume */}
        <div className="crypto-stats">
          <div className="stat">
            <span className="stat-label">Market Cap</span>
            <span className="stat-value">
              ${formatMarketCap(crypto.market_cap)}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Volume</span>
            <span className="stat-value">
              ${formatMarketCap(crypto.total_volume)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
