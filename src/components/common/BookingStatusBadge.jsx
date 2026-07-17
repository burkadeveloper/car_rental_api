import React from "react";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const BookingStatusBadge = ({ status }) => {
  const defaultClass = "bg-gray-100 text-gray-800";
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[status] || defaultClass}`}
    >
      {status || "unknown"}
    </span>
  );
};

export default BookingStatusBadge;
