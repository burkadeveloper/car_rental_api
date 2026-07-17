import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useRegisterMutation } from "../../api/apiSlice";
import { setUser } from "../../features/auth/authSlice";
import Input from "../common/Input";
import Button from "../common/Button";

const RegisterForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    driverLicense: "",
    idNumber: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await register(formData).unwrap();
      dispatch(setUser(result.user));
      navigate("/");
    } catch (err) {
      setError(err.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            {t("create_account") || "Create Account"}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            {t("register_subtitle") || "Join us and start renting"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("full_name") || "Full Name"}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none text-gray-700"
              placeholder={t("name_placeholder") || "John Doe"}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none text-gray-700"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("password")}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none text-gray-700"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("password_min") || "Minimum 6 characters"}
            </p>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("phone")}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none text-gray-700"
              placeholder="09xxxxxxxx"
            />
          </div>

          {/* Driver License */}
          <div>
            <label
              htmlFor="driverLicense"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("driver_license") || "Driver License"}
            </label>
            <input
              id="driverLicense"
              type="text"
              name="driverLicense"
              value={formData.driverLicense}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none text-gray-700"
              placeholder={
                t("license_placeholder") || "License number (optional)"
              }
            />
          </div>

          {/* ID/Passport */}
          <div>
            <label
              htmlFor="idNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("id_passport") || "ID/Passport"}
            </label>
            <input
              id="idNumber"
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none text-gray-700"
              placeholder={
                t("id_placeholder") || "ID or passport number (optional)"
              }
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {t("loading") || "Loading..."}
              </>
            ) : (
              t("register") || "Create Account"
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-6 text-sm text-gray-600">
          {t("have_account") || "Already have an account?"}{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition"
          >
            {t("login") || "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
