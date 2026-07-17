import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const VerificationPendingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded text-center">
      <h2 className="text-2xl font-bold mb-4">📧 Verify Your Email</h2>
      <p className="text-gray-600 mb-2">
        A verification link has been sent to your email address.
      </p>
      <p className="text-gray-500 text-sm mb-6">
        Please check your inbox (and spam folder) and click the link to verify
        your account.
      </p>
      <Link to="/login" className="btn btn-primary">
        Go to Login
      </Link>
    </div>
  );
};

export default VerificationPendingPage;
