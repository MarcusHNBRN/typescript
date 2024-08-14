import React, { useState } from "react";
import { Stock } from "./types";
import { StockSearch } from "./components/StockSearch";
import { StockList } from "./components/StockList";
import styles from "./css/App.module.css";

const App: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);

  const handleAddStock = (newStock: Stock) => {
    if (!stocks.some((stock) => stock.symbol === newStock.symbol)) {
      setStocks((prevStocks) => [...prevStocks, newStock]);
    }
  };

  const handleRemoveStock = (symbol: string) => {
    setStocks((prevStocks) =>
      prevStocks.filter((stock) => stock.symbol !== symbol)
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Stock Market Tracker</h1>
      <StockSearch onAddStock={handleAddStock} />
      <StockList stocks={stocks} onRemoveStock={handleRemoveStock} />
    </div>
  );
};

export default App;
