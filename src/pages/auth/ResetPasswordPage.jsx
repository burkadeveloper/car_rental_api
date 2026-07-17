import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useResetPasswordMutation } from "../../api/apiSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { toast } from "react-toastify";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({ token, newPassword }).unwrap();
      setSuccess(true);
      toast.success("Password reset successful!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const msg =
        err.data?.message || "Invalid or expired reset link. Please try again.";
      setError(msg);
      toast.error(msg);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          ✅ Password Reset
        </h2>
        <p className="text-gray-600">
          Your password has been reset successfully.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          You will be redirected to login shortly.
        </p>
        <Link
          to="/login"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <Input
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength="6"
        />
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="primary"
          className="w-full mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
