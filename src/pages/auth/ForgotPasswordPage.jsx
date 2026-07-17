import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForgotPasswordMutation } from "../../api/apiSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await forgotPassword(email).unwrap();
      setSubmitted(true);
      toast.success("Password reset link sent to your email.");
    } catch (err) {
      const msg =
        err.data?.message || "Failed to send reset link. Please try again.";
      setError(msg);
      toast.error(msg);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded text-center">
        <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
        <p className="text-gray-600">
          We've sent a password reset link to <strong>{email}</strong>.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Click the link in the email to reset your password. The link expires
          in 10 minutes.
        </p>
        <Link
          to="/login"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
      <p className="text-sm text-gray-600 mb-4">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />
        <Button
          type="submit"
          variant="primary"
          className="w-full mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
      <p className="text-center mt-4">
        <Link to="/login" className="text-blue-600 hover:underline">
          Back to Login
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
