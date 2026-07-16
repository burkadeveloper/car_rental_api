import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { useLogoutMutation } from "../../api/apiSlice";
import { logout } from "../../features/auth/authSlice";
import NotificationBell from "../notifications/NotificationBell";

const Header = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = async () => {
    await logoutApi();
    dispatch(logout());
    navigate("/");
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "am" : "en");
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff" || isAdmin;

  // Common nav links (text only)
  const mainNav = [
    { to: "/", label: t("home") },
    { to: "/cars", label: t("cars") },
  ];

  const userNav = [
    { to: "/bookings", label: t("bookings") },
    { to: "/profile", label: t("profile") },
  ];

  const adminNav = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/cars", label: "Car Management" },
    { to: "/admin/bookings", label: "Bookings" },
    { to: "/admin/booked-cars", label: "Booked Cars" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/coupons", label: "Coupons" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm transition-shadow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight"
          >
            {t("appName")}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {mainNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100/80 transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <>
                {userNav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100/80 transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                ))}
                {isStaff && (
                  <Link
                    to="/staff/dashboard"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100/80 transition-all duration-200"
                  >
                    {t("staff")}
                  </Link>
                )}
                {isAdmin && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setIsAdminDropdownOpen(!isAdminDropdownOpen)
                      }
                      className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100/80 transition-all duration-200 flex items-center gap-1"
                    >
                      Admin
                      <svg
                        className={`w-4 h-4 transition-transform ${isAdminDropdownOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isAdminDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-fadeIn">
                        {adminNav.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsAdminDropdownOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </nav>

          {/* Right side: Language, Notification, Profile */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="hidden md:block px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100/80 transition-all"
            >
              {i18n.language === "en" ? "አማ" : "EN"}
            </button>

            <NotificationBell />

            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100/80 transition-colors border-2 border-transparent hover:border-gray-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 capitalize">
                        {user.role}
                      </span>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <span className="w-5 h-5 flex items-center justify-center">
                        👤
                      </span>
                      {t("profile")}
                    </Link>
                    <button
                      onClick={() => {
                        toggleLanguage();
                        setIsProfileOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors w-full text-left"
                    >
                      <span className="w-5 h-5 flex items-center justify-center">
                        🌐
                      </span>
                      {i18n.language === "en" ? "አማርኛ" : "English"}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left border-t border-gray-100 mt-1"
                    >
                      <span className="w-5 h-5 flex items-center justify-center">
                        🚪
                      </span>
                      {t("logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md"
              >
                {t("login")}
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100/80 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/60 animate-slideDown">
            <div className="space-y-1">
              {mainNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100/80 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {user && (
                <>
                  {userNav.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="block px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100/80 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {isStaff && (
                    <Link
                      to="/staff/dashboard"
                      className="block px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100/80 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("staff")}
                    </Link>
                  )}
                  {isAdmin && (
                    <>
                      <div className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Admin
                      </div>
                      {adminNav.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="block px-6 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100/80 hover:text-blue-600 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </>
                  )}
                </>
              )}
              <div className="pt-2 border-t border-gray-200/60 space-y-1">
                <button
                  onClick={() => {
                    toggleLanguage();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100/80 hover:text-blue-600 transition-colors w-full text-left"
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    🌐
                  </span>
                  {i18n.language === "en" ? "አማርኛ" : "English"}
                </button>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <span className="w-5 h-5 flex items-center justify-center">
                      🚪
                    </span>
                    {t("logout")}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="w-5 h-5 flex items-center justify-center">
                      🔐
                    </span>
                    {t("login")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
