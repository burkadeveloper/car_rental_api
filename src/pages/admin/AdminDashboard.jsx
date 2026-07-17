import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetUtilisationReportQuery,
  useGetRevenueReportQuery,
} from "../../api/apiSlice";
import Spinner from "../../components/common/Spinner";
import AdminStats from "../../components/admin/AdminStats";
import RevenueChart from "../../components/admin/RevenueChart";
import Button from "../../components/common/Button";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [dateRange, setDateRange] = useState({
    from: thirtyDaysAgo.toISOString().split("T")[0],
    to: today.toISOString().split("T")[0],
  });

  const {
    data: utilisation,
    isLoading: utilLoading,
    error: utilError,
    refetch: refetchUtil,
  } = useGetUtilisationReportQuery();

  const {
    data: revenue,
    isLoading: revLoading,
    error: revError,
    refetch: refetchRevenue,
  } = useGetRevenueReportQuery(dateRange, {
    refetchOnMountOrArgChange: true,
  });

  const isLoading = utilLoading || revLoading;
  const error = utilError || revError;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("dashboard")}</h1>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
          <p className="ml-4 text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    const message =
      error?.data?.message ||
      error?.message ||
      "Failed to load dashboard data.";
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("dashboard")}</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 text-lg font-medium">⚠️ {message}</p>
          <Button
            variant="primary"
            onClick={() => {
              refetchUtil();
              refetchRevenue();
            }}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("dashboard")}</h1>

      <AdminStats utilisation={utilisation} revenue={revenue} />

      <div className="bg-gray-50 p-4 rounded-lg my-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="label">From</label>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange({ ...dateRange, from: e.target.value })
            }
            className="input"
          />
        </div>
        <div>
          <label className="label">To</label>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="input"
          />
        </div>
        <Button variant="primary" onClick={() => refetchRevenue()}>
          Update
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>
          <RevenueChart data={revenue?.chartData || []} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Fleet Utilisation</h2>
          {utilisation && (
            <div className="text-center">
              <p className="text-gray-600">
                Total Cars: {utilisation.totalCars}
              </p>
              <p className="text-gray-600">Rented: {utilisation.rented}</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {utilisation.utilisation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
