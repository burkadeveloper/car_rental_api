import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand / About */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="text-white text-lg font-semibold mb-3">
              {t("appName") || "Car Rental"}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              {t("footer_tagline") ||
                "Rent your dream car with ease. Reliable, affordable, and hassle-free."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">
              {t("quick_links") || "Quick Links"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("about_us") || "About Us"}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("contact") || "Contact"}
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("faq") || "FAQ"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">
              {t("legal") || "Legal"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("terms") || "Terms of Service"}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("privacy") || "Privacy Policy"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social / Contact Info */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">
              {t("connect") || "Connect"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:support@carrental.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  support@carrental.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+251900000000"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  +251 900 000 000
                </a>
              </li>
              <li className="flex flex-wrap gap-3 pt-1">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} {t("appName") || "Car Rental"}.{" "}
              {t("all_rights") || "All rights reserved."}
            </p>
            <p className="mt-1 sm:mt-0">
              {t("footer_credit") || "Made with ❤️ for your journey"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
