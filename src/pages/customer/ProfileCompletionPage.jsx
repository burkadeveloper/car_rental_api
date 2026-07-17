import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  useUpdateProfileMutation,
  useSendPhoneOTPMutation,
  useVerifyPhoneOTPMutation,
  useUploadLicenseImageMutation,
  useUploadIdImageMutation,
  useSubmitVerificationMutation,
  useLazyGetMeQuery,
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
  const [submitVerification, { isLoading: submitting }] =
    useSubmitVerificationMutation();
  const [getMe] = useLazyGetMeQuery();

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
      const result = await sendOTP({ phone: form.phone }).unwrap();
      setOtpSent(true);
      toast.success("OTP sent to your phone");
      if (result.code) {
        toast.info(`Dev: Your OTP is ${result.code}`);
      }
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
      // Refresh user data to update the image in Redux
      await getMe().unwrap();
      toast.success("License image uploaded");
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
      await getMe().unwrap();
      toast.success("ID image uploaded");
    } catch (err) {
      toast.error(err.data?.message || "Upload failed");
    }
  };

  const handleSubmitVerification = async () => {
    try {
      await submitVerification().unwrap();
      toast.success("Verification request submitted!");
      await getMe().unwrap();
    } catch (err) {
      toast.error(err.data?.message || "Submission failed");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form).unwrap();
      await getMe().unwrap();
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const allRequiredFilled = () => {
    const required = ["phone", "driverLicense", "idNumber", "address"];
    const allFilled = required.every((f) => form[f] && form[f].trim() !== "");
    return (
      allFilled && otpVerified && user?.driverLicenseImage && user?.idImage
    );
  };

  if (!user) return <div>Loading...</div>;

  const { verificationStatus, verificationMessage } = user;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
      <p className="text-sm text-gray-600 mb-4">
        Please fill in all required fields and upload necessary documents, then
        submit for admin verification.
      </p>

      {/* Status display */}
      <div className="mb-4 p-3 rounded bg-gray-50">
        <p className="font-medium">
          Verification Status:
          <span
            className={`ml-2 ${
              verificationStatus === "approved"
                ? "text-green-600"
                : verificationStatus === "pending"
                  ? "text-yellow-600"
                  : verificationStatus === "rejected"
                    ? "text-red-600"
                    : "text-gray-600"
            }`}
          >
            {verificationStatus || "not_submitted"}
          </span>
        </p>
        {verificationMessage && (
          <p className="text-sm text-gray-600 mt-1">
            Message: {verificationMessage}
          </p>
        )}
        {verificationStatus === "approved" && (
          <p className="text-green-600 text-sm mt-1">
            ✅ You are verified! You can now book cars.
          </p>
        )}
        {verificationStatus === "pending" && (
          <p className="text-yellow-600 text-sm mt-1">
            ⏳ Your verification is pending admin approval.
          </p>
        )}
        {verificationStatus === "rejected" && (
          <p className="text-red-600 text-sm mt-1">
            ❌ Verification rejected. Please update and resubmit.
          </p>
        )}
      </div>

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

      <form onSubmit={handleSaveProfile} className="space-y-4">
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
            placeholder="e.g., +251912345678"
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

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </form>

      {/* Submit for verification button */}
      <div className="mt-6 border-t pt-4">
        {verificationStatus === "not_submitted" && allRequiredFilled() && (
          <Button
            variant="primary"
            onClick={handleSubmitVerification}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit for Verification"}
          </Button>
        )}
        {verificationStatus === "rejected" && allRequiredFilled() && (
          <Button
            variant="primary"
            onClick={handleSubmitVerification}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Resubmit for Verification"}
          </Button>
        )}
        {verificationStatus === "pending" && (
          <p className="text-yellow-600">
            ⏳ Your verification is pending admin approval.
          </p>
        )}
        {verificationStatus === "approved" && (
          <p className="text-green-600">
            ✅ You are verified! You can now book cars.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileCompletionPage;
