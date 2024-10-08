import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchHistoricalData } from "../api";
import styles from "../css/StockList.module.css";

interface StockGraphProps {
  symbol: string;
}

const timeRanges = [
  { label: "1M", days: 30 },
  { label: "1Y", days: 365 },
  { label: "5Y", days: 1825 },
  { label: "10Y", days: 3650 },
];

export const StockGraph: React.FC<StockGraphProps> = ({ symbol }) => {
  const [data, setData] = useState<any[]>([]);
  const [selectedRange, setSelectedRange] = useState(timeRanges[0]);

  useEffect(() => {
    const fetchData = async () => {
      const historicalData = await fetchHistoricalData(
        symbol,
        selectedRange.label
      );
      setData(historicalData.slice(0, selectedRange.days));
    };
    fetchData();
  }, [symbol, selectedRange]);

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    if (selectedRange.label === "10Y") {
      return date.getFullYear().toString();
    } else if (selectedRange.label === "5Y") {
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      });
    } else if (selectedRange.label === "1Y") {
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } else {
      return date.toLocaleDateString(undefined, {
        month: "numeric",
        day: "numeric",
      });
    }
  };

  const getTickInterval = () => {
    switch (selectedRange.label) {
      case "10Y":
        return 365;
      case "5Y":
        return 182;
      case "1Y":
        return 30;
      default:
        return 7;
    }
  };

  return (
    <div className={styles.graphContainer}>
      <div className={styles.rangeButtons}>
        {timeRanges.map((range) => (
          <button
            key={range.label}
            onClick={() => setSelectedRange(range)}
            className={`${styles.rangeButton} ${
              selectedRange === range ? styles.active : ""
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            interval={getTickInterval()}
            stroke="#e0e0e0"
          />
          <YAxis stroke="#e0e0e0" />
          <Tooltip
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
            contentStyle={{
              backgroundColor: "#2c2c2c",
              border: "1px solid #444",
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
