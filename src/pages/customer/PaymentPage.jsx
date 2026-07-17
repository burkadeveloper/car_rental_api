import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useGetBookingQuery,
  useInitiatePaymentMutation,
} from "../../api/apiSlice";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import { formatCurrency } from "../../utils/currency";
import { toast } from "react-toastify";

const PaymentPage = () => {
  const { bookingId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    data: booking,
    isLoading,
    error,
    refetch,
  } = useGetBookingQuery(bookingId);
  const [initiatePayment, { isLoading: paymentLoading }] =
    useInitiatePaymentMutation();
  const [paymentMethod, setPaymentMethod] = useState("chapa");
  const [paymentError, setPaymentError] = useState("");

  const handlePayment = async () => {
    setPaymentError("");
    try {
      const result = await initiatePayment({
        bookingId,
        method: paymentMethod,
      }).unwrap();
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        setPaymentError("No redirect URL received.");
      }
    } catch (err) {
      const msg =
        err.data?.message || "Payment initiation failed. Please try again.";
      setPaymentError(msg);
      toast.error(msg);
    }
  };

  const handlePayOnArrival = () => {
    toast.info("You selected Pay on Arrival. Your booking is confirmed.");
    navigate(`/payment-success?bookingId=${bookingId}&payOnArrival=true`);
  };

  if (isLoading) return <Spinner />;
  if (error)
    return <div className="text-red-500">Error loading booking details.</div>;
  if (!booking) return <div>Booking not found.</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">{t("payment")}</h2>
      <div className="mb-4">
        <p>
          <strong>Booking ID:</strong> {booking._id}
        </p>
        <p>
          <strong>Car:</strong> {booking.car?.make} {booking.car?.model}
        </p>
        <p>
          <strong>Total:</strong> {formatCurrency(booking.totalCost)}
        </p>
        <p>
          <strong>Status:</strong> {booking.status}
        </p>
      </div>
      <div className="mb-4">
        <label className="label">{t("paymentMethod")}</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="input"
        >
          <option value="chapa">Chapa (Ethiopian) – Mock enabled</option>
          <option value="stripe">Credit Card (Stripe) – Test</option>
          <option value="telebirr">Telebirr – Coming soon</option>
        </select>
      </div>
      {paymentError && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {paymentError}
        </div>
      )}
      <Button
        variant="primary"
        className="w-full"
        onClick={handlePayment}
        disabled={paymentLoading}
      >
        {paymentLoading ? t("loading") : t("payNow")}
      </Button>
      <div className="mt-4 text-center text-sm text-gray-500">
        <button
          onClick={handlePayOnArrival}
          className="text-blue-600 hover:underline"
        >
          Or, choose "Pay on Arrival"
        </button>
      </div>
      <button
        className="mt-2 text-sm text-gray-600 hover:underline"
        onClick={() => navigate("/bookings")}
      >
        Cancel and go back
      </button>
    </div>
  );
};

export default PaymentPage;
