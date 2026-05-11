import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DownOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import logo from "../../assets/Logo.png";
import Cookies from "js-cookie"; // Used to check the 'user' cookie for login status

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group shrink-0">
    <div className="transition-transform duration-300 group-hover:rotate-12">
      <img
        src={logo}
        alt="Vault Logo"
        style={{ height: "40px", width: "auto" }}
      />
    </div>
    <span className="font-bold text-lg md:text-xl tracking-tight text-gray-900">
      Vault
    </span>
  </Link>
);

const Navbar = () => {
  // --- 1. STATE MANAGEMENT ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Main hamburger menu toggle
  const [isServicesOpen, setIsServicesOpen] = useState(false); // Mobile sub-menu (Services) toggle
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if user is authenticated

  // --- 2. AUTHENTICATION CHECK ---
  // Runs once when the component mounts to check if the 'user' cookie exists
  useEffect(() => {
    const user = Cookies.get("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close the sub-menu automatically when the main menu closes
    if (isMobileMenuOpen) setIsServicesOpen(false);
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/60 backdrop-blur-lg border-b border-gray-100 px-4 md:px-0">
      <div className="max-w-350 mx-auto py-3">
        {/* Main Nav Bar Container */}
        <div className="bg-white rounded-full shadow-lg border border-gray-100/50 flex items-center h-14 md:h-16 px-2 relative">
          {/* Section: Logo (Left) */}
          <div className="flex-1 flex justify-start pl-2 md:pl-4">
            <Logo />
          </div>

          {/* Section: Desktop Navigation Links (Center) */}
          <div className="hidden md:flex items-center gap-1 lg:gap-4">
            {/* Desktop Dropdown for Services */}
            <div className="relative group">
              <button className="text-gray-600 hover:text-blue-600 px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 hover:bg-blue-50">
                Services <DownOutlined className="text-[10px] mt-0.5" />
              </button>
              {/* This dropdown appears on hover via Tailwind 'group-hover' */}
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-10 p-2">
                <Link
                  to="/Product/A"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl"
                >
                  Web Applications
                </Link>
                <Link
                  to="/Product/B"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl"
                >
                  Mobile Applications
                </Link>
              </div>
            </div>

            <Link
              to="/About"
              className="text-gray-600 hover:text-blue-600 px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-blue-50"
            >
              About
            </Link>

            <Link
              to="/ContactUs"
              className="text-gray-600 hover:text-blue-600 px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-blue-50"
            >
              Contact Us
            </Link>
          </div>

          {/* Section: Auth Buttons & Mobile Toggle (Right) */}
          <div className="flex-1 flex justify-end items-center pr-2 gap-2">
            {/* Conditional Logic: Swap Login for Dashboard if logged in */}
            {isLoggedIn ? (
              <Link to="/Dashboard">
                <button className="flex items-center gap-2 bg-blue-600 text-white p-2.5 md:px-6 md:py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-md transform hover:scale-105">
                  <DashboardOutlined />
                  <span className="hidden md:inline">Go to Dashboard</span>
                </button>
              </Link>
            ) : (
              <Link to="/login">
                <button className="flex items-center gap-2 bg-gray-900 text-white p-2.5 md:px-6 md:py-2.5 rounded-full text-sm font-medium hover:bg-blue-600 transition-all shadow-md transform hover:scale-105">
                  <UserOutlined />
                  <span className="hidden md:inline">Login</span>
                </button>
              </Link>
            )}

            {/* Hamburger Toggle (Visible only on mobile) */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors text-xl flex items-center justify-center"
            >
              {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            </button>
          </div>
        </div>

        {/* --- MOBILE DROPDOWN MENU --- */}
        <div
          className={`
          md:hidden absolute left-4 right-4 mt-4 bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 transition-all duration-300 transform z-50
          ${isMobileMenuOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-4 opacity-0 invisible"}
        `}
        >
          <div className="flex flex-col space-y-1">
            {/* Nested Services Dropdown for Mobile */}
            <div className="flex flex-col">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className={`flex items-center justify-between p-4 rounded-2xl transition-colors font-medium w-full ${isServicesOpen ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-blue-50"}`}
              >
                <span>Services</span>
                <DownOutlined
                  className={`text-xs transition-transform duration-300 ${isServicesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Sub-menu items (Web & Mobile Apps) */}
              <div
                className={`overflow-hidden transition-all duration-300 bg-slate-50/50 rounded-2xl mx-2 ${isServicesOpen ? "max-h-40 py-2 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
              >
                <Link
                  to="/Product/A"
                  onClick={toggleMenu}
                  className="block px-6 py-3 text-sm text-gray-600 hover:text-blue-600 font-medium italic"
                >
                  • Web Applications
                </Link>
                <Link
                  to="/Product/B"
                  onClick={toggleMenu}
                  className="block px-6 py-3 text-sm text-gray-600 hover:text-blue-600 font-medium italic"
                >
                  • Mobile Applications
                </Link>
              </div>
            </div>

            {/* Standard Mobile Links */}
            <Link
              to="/About"
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 p-4 rounded-2xl hover:bg-blue-50 transition-colors font-medium"
            >
              About
            </Link>
            <Link
              to="/ContactUs"
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 p-4 rounded-2xl hover:bg-blue-50 transition-colors font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
