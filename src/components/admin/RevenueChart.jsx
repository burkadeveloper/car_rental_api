import React from "react";
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
import { formatCurrency } from "../../utils/currency";

const RevenueChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No revenue data available for the selected period.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis
          tickFormatter={(value) => formatCurrency(value).replace("ETB", "")}
        />
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Legend />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          name="Revenue (ETB)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
