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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">{t("register")}</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <Input
          label={t("name")}
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          label={t("password")}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength="6"
        />
        <Input
          label={t("phone")}
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <Input
          label="Driver License"
          name="driverLicense"
          value={formData.driverLicense}
          onChange={handleChange}
        />
        <Input
          label="ID/Passport"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleChange}
        />
        <Button
          type="submit"
          variant="primary"
          className="w-full mt-4"
          disabled={isLoading}
        >
          {isLoading ? t("loading") : t("register")}
        </Button>
      </form>
      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          {t("login")}
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
