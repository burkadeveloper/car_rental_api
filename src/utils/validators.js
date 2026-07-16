export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone) => {
  // Ethiopian phone format: 09xxxxxxxx
  return /^(09|07)\d{8}$/.test(phone);
};
/**
 * Check if a user's profile is complete (all required fields filled)
 */
export const isProfileComplete = (user) => {
  if (!user) return false;
  const required = [
    "phone",
    "driverLicense",
    "driverLicenseImage",
    "idNumber",
    "idImage",
    "address",
  ];
  for (const field of required) {
    if (!user[field] || user[field].trim() === "") return false;
  }
  if (!user.isPhoneVerified) return false;
  return true;
};
