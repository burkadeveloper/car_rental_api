import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const UtilisationChart = ({ data }) => {
  if (!data) return <p className="text-center text-gray-500">No data</p>;
  const chartData = [
    { name: "Rented", value: data.rented || 0 },
    { name: "Available", value: (data.totalCars || 0) - (data.rented || 0) },
  ];
  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default UtilisationChart;
