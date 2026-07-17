import React from "react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/currency";

const AdminStats = ({ utilisation, revenue }) => {
  const { t } = useTranslation();

  if (!revenue || !utilisation) {
    return <div className="text-gray-500">No data available</div>;
  }

  const stats = [
    {
      title: "Total Users",
      value: revenue.totalUsers || 0,
      icon: "👥",
    },
    {
      title: "Total Bookings (Last 30d)",
      value: revenue.totalBookings || 0,
      icon: "📋",
    },
    {
      title: "Revenue (Last 30d)",
      value: formatCurrency(revenue.revenue || 0),
      icon: "💰",
    },
    {
      title: "Fleet Utilisation",
      value: utilisation.utilisation || "0%",
      icon: "🚗",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className="text-4xl">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
