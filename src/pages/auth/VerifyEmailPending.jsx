import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const VerifyEmailPending = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const email = location.state?.email || "your email";

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded text-center">
      <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
      <p className="text-gray-600">
        We've sent a verification link to <strong>{email}</strong>.
      </p>
      <p className="text-gray-500 text-sm mt-2">
        Please check your inbox and click the link to verify your account.
      </p>
      <p className="text-gray-500 text-sm mt-4">
        Once verified, you can{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          login
        </Link>
        .
      </p>
      <div className="mt-6">
        <Link to="/login" className="btn btn-primary">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailPending;
