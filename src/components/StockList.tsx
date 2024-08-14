import React from "react";
import { Stock } from "../types";
import styles from "../css/StockList.module.css";

interface StockListProps {
  stocks: Stock[];
  onRemoveStock: (symbol: string) => void;
}

export const StockList: React.FC<StockListProps> = ({
  stocks,
  onRemoveStock,
}) => {
  return (
    <table className={styles.stockTable}>
      <thead>
        <tr>
          <th>Symbol</th>
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
              className={stock.change >= 0 ? styles.positive : styles.negative}
            >
              {stock.change >= 0 ? "+" : ""}
              {stock.change.toFixed(2)}%
            </td>
            <td>
              <button
                onClick={() => onRemoveStock(stock.symbol)}
                className={styles.removeButton}
              >
                remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
