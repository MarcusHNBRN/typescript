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

  const handleSearch = async () => {
    if (query.trim()) {
      setLoading(true);
      try {
        const searchResults = await searchStocks(query);
        setResults(searchResults);
      } catch (error) {
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

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Stocks..."
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching" : "Search"}
      </button>
      <ul>
        {results.map((stock) => (
          <li key={stock.symbol}>
            {stock.symbol} - {stock.name}
            <button onClick={() => handleAddStock(stock)}>Lägg till</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
