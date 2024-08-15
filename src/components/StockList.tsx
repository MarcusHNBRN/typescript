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
      <table className={styles.stockTable}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
            <th>Change</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.symbol}>
              <td>{stock.symbol}</td>
              <td>{stock.name}</td>
              <td>${stock.price.toFixed(2)}</td>
              <td
                className={
                  stock.change >= 0 ? styles.positive : styles.negative
                }
              >
                {stock.change >= 0 ? "+" : ""}
                {stock.change.toFixed(2)}%
              </td>
              <td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
