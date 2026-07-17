import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetRevenueReportQuery,
  useGetUtilisationReportQuery,
} from "../../api/apiSlice";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import { formatCurrency } from "../../utils/currency";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminReports = () => {
  const { t } = useTranslation();
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [dateRange, setDateRange] = useState({
    from: thirtyDaysAgo.toISOString().split("T")[0],
    to: today.toISOString().split("T")[0],
  });

  // Fetch revenue report with date range
  const {
    data: revenueData,
    isLoading: revLoading,
    error: revError,
    refetch: refetchRevenue,
  } = useGetRevenueReportQuery(dateRange);

  // Fetch utilisation report
  const {
    data: utilisation,
    isLoading: utilLoading,
    error: utilError,
    refetch: refetchUtil,
  } = useGetUtilisationReportQuery();

  const isLoading = revLoading || utilLoading;
  const error = revError || utilError;

  const handleDateChange = (field, value) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const handleRefresh = () => {
    refetchRevenue();
    refetchUtil();
  };

  // Export revenue report as Excel
  const handleExport = () => {
    window.open(
      `/api/v1/admin/reports/revenue/export?from=${dateRange.from}&to=${dateRange.to}`,
      "_blank",
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("reports")}</h1>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
          <p className="ml-4 text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    const message =
      error?.data?.message || error?.message || "Failed to load reports.";
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("reports")}</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center my-8">
          <p className="text-red-600 text-lg font-medium">⚠️ {message}</p>
          <Button variant="primary" onClick={handleRefresh} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = revenueData?.chartData || [];
  const totalRevenue = revenueData?.revenue || 0;
  const totalBookings = revenueData?.totalBookings || 0;
  const totalUsers = revenueData?.totalUsers || 0;

  // Pie chart data for utilisation
  const pieData = utilisation
    ? [
        { name: "Rented", value: utilisation.rented || 0 },
        {
          name: "Available",
          value: (utilisation.totalCars || 0) - (utilisation.rented || 0),
        },
      ]
    : [];
  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("reports")}</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-2xl font-bold">{totalBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-500">Fleet Utilisation</p>
          <p className="text-2xl font-bold">
            {utilisation?.utilisation || "0%"}
          </p>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="label">From</label>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => handleDateChange("from", e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="label">To</label>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => handleDateChange("to", e.target.value)}
            className="input"
          />
        </div>
        <Button variant="primary" onClick={handleRefresh}>
          Update
        </Button>
        <Button variant="secondary" onClick={handleExport}>
          Export Excel
        </Button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
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
          ) : (
            <p className="text-gray-500 text-center py-10">
              No revenue data available for the selected period.
            </p>
          )}
        </div>

        {/* Utilisation Pie Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Fleet Utilisation</h2>
          {utilisation && utilisation.totalCars > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
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
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-10">
              No fleet data available.
            </p>
          )}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Total Cars:{" "}
              <span className="font-semibold">
                {utilisation?.totalCars || 0}
              </span>
              {" | "}
              Rented:{" "}
              <span className="font-semibold">{utilisation?.rented || 0}</span>
              {" | "}
              Available:{" "}
              <span className="font-semibold">
                {(utilisation?.totalCars || 0) - (utilisation?.rented || 0)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
