import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useVerifyEmailMutation } from "../../api/apiSlice";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [verifyEmail, { isLoading, error, data }] = useVerifyEmailMutation();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    if (token) {
      verifyEmail(token)
        .unwrap()
        .then(() => setStatus("success"))
        .catch(() => setStatus("error"));
    }
  }, [token, verifyEmail]);

  if (status === "verifying") {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
        <p className="ml-4 text-gray-600">Verifying your email...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Verification Failed
        </h2>
        <p className="text-gray-600">
          The verification link is invalid or has expired.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Please try registering again or contact support.
        </p>
        <Link to="/login" className="btn btn-primary mt-4 inline-block">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        ✅ Email Verified!
      </h2>
      <p className="text-gray-600">
        Your email has been successfully verified.
      </p>
      <p className="text-gray-500 text-sm mt-2">
        You can now log in to your account.
      </p>
      <Link to="/login" className="btn btn-primary mt-4 inline-block">
        Proceed to Login
      </Link>
    </div>
  );
};

export default VerifyEmailPage;
