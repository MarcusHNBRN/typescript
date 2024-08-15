import React, { useState } from "react";
import { Stock } from "../types";
import styles from "../css/StockList.module.css";
import { StockGraph } from "./StockGraph";

interface StockListProps {
  stocks: Stock[];
  onRemoveStock: (symbol: string) => void;
}

export const StockList: React.FC<StockListProps> = ({
  stocks,
  onRemoveStock,
}) => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  const handleCloseGraph = () => {
    setSelectedStock(null);
  };

  return (
    <div>
      <div className={styles.stockGrid}>
        {stocks.map((stock) => (
          <div key={stock.symbol} className={styles.stockBox}>
            <div className={styles.stockInfo}>
              <div className={styles.stockSymbol}>{stock.symbol}</div>
              <div className={styles.stockName}>{stock.name}</div>
              <div className={styles.stockPrice}>${stock.price.toFixed(2)}</div>
              <div
                className={`${styles.stockChange} ${
                  stock.change >= 0 ? styles.positive : styles.negative
                }`}
              >
                {stock.change >= 0 ? "+" : ""}
                {stock.change.toFixed(2)}%
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <button
                onClick={() => onRemoveStock(stock.symbol)}
                className={styles.removeButton}
              >
                Remove
              </button>
              <button
                onClick={() => setSelectedStock(stock.symbol)}
                className={styles.viewGraphButton}
              >
                View Graph
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedStock && (
        <div className={styles.graphContainer}>
          <div className={styles.graphHeader}>
            <h2>Graph for {selectedStock}</h2>
            <button onClick={handleCloseGraph} className={styles.closeButton}>
              Close
            </button>
          </div>
          <StockGraph symbol={selectedStock} />
        </div>
      )}
    </div>
  );
};
