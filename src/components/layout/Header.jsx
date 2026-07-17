import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [logoutApi] = useLogoutMutation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutApi();
    dispatch(logout());
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "am" : "en");
  };

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff" || isAdmin;

  // Helper to check active route
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 text-white shadow-lg border-b border-blue-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight hover:text-blue-100 transition-colors"
          >
            {t("appName")}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive("/")
                  ? "bg-white/20 text-white"
                  : "hover:bg-white/10 hover:text-white"
              }`}
            >
              {t("home")}
            </Link>
            <Link
              to="/cars"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive("/cars")
                  ? "bg-white/20 text-white"
                  : "hover:bg-white/10 hover:text-white"
              }`}
            >
              {t("cars")}
            </Link>

            {user && (
              <>
                <Link
                  to="/bookings"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive("/bookings")
                      ? "bg-white/20 text-white"
                      : "hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {t("bookings")}
                </Link>
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive("/profile")
                      ? "bg-white/20 text-white"
                      : "hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {t("profile")}
                </Link>
                {isStaff && (
                  <Link
                    to="/staff/dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/staff/dashboard")
                        ? "bg-white/20 text-white"
                        : "hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {t("staff")}
                  </Link>
                )}
                {isAdmin && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive("/admin/dashboard")
                          ? "bg-white/20 text-white"
                          : "hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/cars"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive("/admin/cars")
                          ? "bg-white/20 text-white"
                          : "hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      Cars
                    </Link>
                    <Link
                      to="/admin/bookings"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive("/admin/bookings")
                          ? "bg-white/20 text-white"
                          : "hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      Bookings
                    </Link>
                    <Link
                      to="/admin/users"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive("/admin/users")
                          ? "bg-white/20 text-white"
                          : "hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      Users
                    </Link>
                    <Link
                      to="/admin/coupons"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive("/admin/coupons")
                          ? "bg-white/20 text-white"
                          : "hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      Coupons
                    </Link>
                  </>
                )}
              </>
            )}

            <div className="flex items-center space-x-2 ml-2">
              <button
                onClick={toggleLanguage}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors"
              >
                {i18n.language === "en" ? "አማርኛ" : "English"}
              </button>
              <NotificationBell />
              {user ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium bg-red-500/80 hover:bg-red-600 transition-colors"
                >
                  {t("logout")}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-lg text-sm font-medium bg-white text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  {t("login")}
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-1 bg-blue-800/95 border-t border-blue-600/30">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/")
                ? "bg-white/20 text-white"
                : "hover:bg-white/10 text-gray-100"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t("home")}
          </Link>
          <Link
            to="/cars"
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/cars")
                ? "bg-white/20 text-white"
                : "hover:bg-white/10 text-gray-100"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t("cars")}
          </Link>

          {user && (
            <>
              <Link
                to="/bookings"
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/bookings")
                    ? "bg-white/20 text-white"
                    : "hover:bg-white/10 text-gray-100"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("bookings")}
              </Link>
              <Link
                to="/profile"
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/profile")
                    ? "bg-white/20 text-white"
                    : "hover:bg-white/10 text-gray-100"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("profile")}
              </Link>
              {isStaff && (
                <Link
                  to="/staff/dashboard"
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/staff/dashboard")
                      ? "bg-white/20 text-white"
                      : "hover:bg-white/10 text-gray-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("staff")}
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/admin/dashboard")
                        ? "bg-white/20 text-white"
                        : "hover:bg-white/10 text-gray-100"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/cars"
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/admin/cars")
                        ? "bg-white/20 text-white"
                        : "hover:bg-white/10 text-gray-100"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Cars
                  </Link>
                  <Link
                    to="/admin/bookings"
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/admin/bookings")
                        ? "bg-white/20 text-white"
                        : "hover:bg-white/10 text-gray-100"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Bookings
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/admin/users")
                        ? "bg-white/20 text-white"
                        : "hover:bg-white/10 text-gray-100"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/coupons"
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/admin/coupons")
                        ? "bg-white/20 text-white"
                        : "hover:bg-white/10 text-gray-100"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Coupons
                  </Link>
                </>
              )}
            </>
          )}

          <div className="flex items-center space-x-3 pt-2 mt-2 border-t border-blue-600/30">
            <button
              onClick={() => {
                toggleLanguage();
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors"
            >
              {i18n.language === "en" ? "አማርኛ" : "English"}
            </button>
            <NotificationBell />
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-lg text-sm font-medium bg-red-500/80 hover:bg-red-600 transition-colors"
              >
                {t("logout")}
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-lg text-sm font-medium bg-white text-blue-700 hover:bg-blue-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("login")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
