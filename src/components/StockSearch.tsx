import React, { useState } from "react";
import { Stock } from "../types";
import styles from "../css/StockSearch.module.css";
import { searchStocks, fetchStockData } from "../api";

interface StockSearchProps {
  onAddStock: (stock: Stock) => void;
}

export const StockSearch: React.FC<StockSearchProps> = ({ onAddStock }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (query.trim()) {
      setLoading(true);
      setError(null);
      try {
        console.log("Searching for:", query);
        const searchResults = await searchStocks(query);
        console.log("Search results:", searchResults);
        setResults(searchResults);
      } catch (error) {
        console.error("Error in handleSearch:", error);
        console.error("Error searching stocks:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddStock = async (stock: Stock) => {
    const fullStockData = await fetchStockData(stock.symbol);
    if (fullStockData) {
      onAddStock(fullStockData);
    }
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const displayedResults = showAll ? results : results.slice(0, 3);

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Stocks..."
        className={styles.searchInput}
      />
      <button
        className={styles.searchButton}
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? "Searching" : "Search"}
      </button>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <ul className={styles.resultsList}>
        {displayedResults.map((stock) => (
          <li key={stock.symbol} className={styles.resultItem}>
            <span>
              {stock.symbol} - {stock.name}
            </span>
            <button
              onClick={() => handleAddStock(stock)}
              className={styles.addButton}
            >
              Add
            </button>
          </li>
        ))}
      </ul>
      {results.length > 3 && (
        <button onClick={toggleShowAll} className={styles.toggleResultsButton}>
          {showAll ? "Show Less" : `Show More (${results.length - 3} left)`}
        </button>
      )}
    </div>
  );
};
