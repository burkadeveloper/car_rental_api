import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../../components/common/Spinner";
// import { fetchStaffStats } from '../../features/staff/staffSlice';

const StaffDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.staff || {});

  useEffect(() => {
    // dispatch(fetchStaffStats());
  }, [dispatch]);

  if (loading) return <Spinner />;
  if (error)
    return <div className="text-red-500">Error loading staff dashboard</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Staff Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Today's Bookings</p>
          <p className="text-2xl font-bold">{stats?.todayBookings || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Pending Pickups</p>
          <p className="text-2xl font-bold">{stats?.pendingPickups || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Pending Returns</p>
          <p className="text-2xl font-bold">{stats?.pendingReturns || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
