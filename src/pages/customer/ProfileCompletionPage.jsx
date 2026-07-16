import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  useUpdateProfileMutation,
  useSendPhoneOTPMutation,
  useVerifyPhoneOTPMutation,
  useUploadLicenseImageMutation,
  useUploadIdImageMutation,
} from "../../api/apiSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { isProfileComplete } from "../../utils/validators";

const ProfileCompletionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || "/";

  const [updateProfile] = useUpdateProfileMutation();
  const [sendOTP] = useSendPhoneOTPMutation();
  const [verifyOTP] = useVerifyPhoneOTPMutation();
  const [uploadLicense] = useUploadLicenseImageMutation();
  const [uploadId] = useUploadIdImageMutation();

  const [form, setForm] = useState({
    phone: user?.phone || "",
    driverLicense: user?.driverLicense || "",
    idNumber: user?.idNumber || "",
    address: user?.address || "",
    profilePicture: user?.profilePicture || "",
  });
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(
    user?.isPhoneVerified || false,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.isPhoneVerified) setOtpVerified(true);
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async () => {
    if (!form.phone) {
      toast.error("Please enter your phone number first.");
      return;
    }
    try {
      await sendOTP({ phone: form.phone }).unwrap();
      setOtpSent(true);
      toast.success("OTP sent to your phone");
    } catch (err) {
      toast.error(err.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await verifyOTP({ code: otpCode }).unwrap();
      setOtpVerified(true);
      toast.success("Phone verified");
    } catch (err) {
      toast.error(err.data?.message || "Invalid OTP");
    }
  };

  const handleUploadLicense = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      await uploadLicense(formData).unwrap();
      toast.success("License image uploaded");
      // The user object will be updated via the invalidated tags
    } catch (err) {
      toast.error(err.data?.message || "Upload failed");
    }
  };

  const handleUploadId = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      await uploadId(formData).unwrap();
      toast.success("ID image uploaded");
    } catch (err) {
      toast.error(err.data?.message || "Upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form).unwrap();
      toast.success("Profile updated successfully");

      // Wait a moment then redirect to the original destination
      setTimeout(() => {
        navigate(returnTo);
      }, 500);
    } catch (err) {
      toast.error(err.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // Check if all required fields are filled and phone verified
  const allRequiredFilled = () => {
    const required = ["phone", "driverLicense", "idNumber", "address"];
    const allFilled = required.every((f) => form[f] && form[f].trim() !== "");
    return (
      allFilled && otpVerified && user?.driverLicenseImage && user?.idImage
    );
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
      <p className="text-sm text-gray-600 mb-4">
        Please fill in all required fields and upload necessary documents before
        booking a car.
      </p>

      <div className="bg-gray-50 p-4 rounded mb-6">
        <p className="text-sm font-medium">Completion Status:</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <span
            className={`px-2 py-1 text-xs rounded ${form.phone && otpVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            Phone {otpVerified ? "✅" : "❌"}
          </span>
          <span
            className={`px-2 py-1 text-xs rounded ${form.driverLicense && user?.driverLicenseImage ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            License{" "}
            {form.driverLicense && user?.driverLicenseImage ? "✅" : "❌"}
          </span>
          <span
            className={`px-2 py-1 text-xs rounded ${form.idNumber && user?.idImage ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            ID {form.idNumber && user?.idImage ? "✅" : "❌"}
          </span>
          <span
            className={`px-2 py-1 text-xs rounded ${form.address ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            Address {form.address ? "✅" : "❌"}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Driver License Number (required)</label>
          <Input
            name="driverLicense"
            value={form.driverLicense}
            onChange={handleChange}
            placeholder="e.g., DL-123456"
            required
          />
          <div className="mt-2">
            <label className="label">Upload License Image (required)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadLicense}
            />
            {user?.driverLicenseImage && (
              <img
                src={user.driverLicenseImage}
                alt="License"
                className="w-24 h-24 object-cover mt-2 rounded"
              />
            )}
          </div>
        </div>

        <div>
          <label className="label">ID/Passport Number (required)</label>
          <Input
            name="idNumber"
            value={form.idNumber}
            onChange={handleChange}
            placeholder="e.g., ID-789012"
            required
          />
          <div className="mt-2">
            <label className="label">Upload ID Image (required)</label>
            <input type="file" accept="image/*" onChange={handleUploadId} />
            {user?.idImage && (
              <img
                src={user.idImage}
                alt="ID"
                className="w-24 h-24 object-cover mt-2 rounded"
              />
            )}
          </div>
        </div>

        <Input
          label="Address (required)"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="e.g., Addis Ababa, Bole"
          required
        />

        <div>
          <Input
            label="Phone (required)"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="e.g., 0912345678"
            required
          />
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleSendOTP}
              disabled={otpSent}
            >
              Send OTP
            </Button>
            {otpSent && (
              <>
                <Input
                  label="OTP Code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-32"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleVerifyOTP}
                >
                  Verify
                </Button>
                {otpVerified && (
                  <span className="text-green-600 text-sm">✔ Verified</span>
                )}
              </>
            )}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={loading || !allRequiredFilled()}
        >
          {loading ? "Saving..." : "Save Profile & Continue"}
        </Button>
      </form>
    </div>
  );
};

export default ProfileCompletionPage;
