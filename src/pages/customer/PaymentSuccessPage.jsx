import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../components/common/Button";

const PaymentSuccessPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const mock = searchParams.get("mock") === "true";
  const payOnArrival = searchParams.get("payOnArrival") === "true";

  useEffect(() => {
    console.log("Payment success for booking:", bookingId);
  }, [bookingId]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        ✅ Payment Successful!
      </h1>
      {mock && (
        <p className="text-gray-500">
          This was a <strong>mock</strong> payment (Chapa test mode).
        </p>
      )}
      {payOnArrival && (
        <p className="text-gray-500">
          You selected <strong>Pay on Arrival</strong>. Please pay at the pickup
          location.
        </p>
      )}
      <p className="mt-2">
        Booking ID: <strong>{bookingId}</strong>
      </p>
      <div className="mt-6 space-x-3">
        <Button variant="primary" onClick={() => navigate("/bookings")}>
          View My Bookings
        </Button>
        <Button variant="secondary" onClick={() => navigate("/")}>
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
