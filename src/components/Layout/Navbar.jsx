import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  DownOutlined, 
  UserOutlined,
  MenuOutlined, 
  CloseOutlined 
} from '@ant-design/icons';
import logo from '../../assets/Logo.png'

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group shrink-0">
    <div className="transition-transform duration-300 group-hover:rotate-12">
      {/* <svg Link="">
        <path d="M 10 50 L 50 10 L 90 50 L 50 90 Z" />
      </svg> */}
      <img 
      src={logo} 
      alt="Vault Logo"
      style={{height:'40px',width:'auto'}}
       />
    </div>
    <span className="font-bold text-lg md:text-xl tracking-tight text-gray-900">
      Vault
    </span>
  </Link>
);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/60 backdrop-blur-lg border-b border-gray-100 px-4 md:px-0">
      <div className="max-w-350 mx-auto py-3">
        {/* Main Floating Bar */}
        <div className="bg-white rounded-full shadow-lg border border-gray-100/50 flex items-center h-14 md:h-16 px-2 relative">
          
          {/* 1. Left Section: Logo - Always Visible */}
          <div className="flex-1 flex justify-start pl-2 md:pl-4">
            <Logo />
          </div>

          {/* 2. Center Section: Navigation Links - Hidden on Mobile (< 768px) */}
          <div className="hidden md:flex items-center gap-1 lg:gap-4">
            <div className="relative group">
              <button className="text-gray-600 hover:text-blue-600 px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 hover:bg-blue-50">
                Services <DownOutlined className="text-[10px] mt-0.5" />
              </button>
              {/* Desktop Dropdown */}
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-10 p-2">
                <Link to="/Product/A" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl">Web Applications</Link>
                <Link to="/Product/B" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl">Mobile Applications</Link>
              </div>
            </div>
            
            <Link to="/About" className="text-gray-600 hover:text-blue-600 px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-blue-50">
              About
            </Link>
            
            <Link to="/ContactUs" className="text-gray-600 hover:text-blue-600 px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-blue-50">
              Contact Us
            </Link>
          </div>

          {/* 3. Right Section: Login & Mobile Toggle */}
          <div className="flex-1 flex justify-end items-center pr-2 gap-2">
            {/* Login Button - Icon only on mobile, text on desktop */}
            <Link to="/login">
              <button className="flex items-center gap-2 bg-gray-900 text-white p-2.5 md:px-6 md:py-2.5 rounded-full text-sm font-medium hover:bg-blue-600 transition-all shadow-md transform hover:scale-105">
                <UserOutlined /> 
                <span className="hidden md:inline">Login</span>
              </button>
            </Link>

            {/* Hamburger Toggle - Only visible on mobile */}
            <button 
              onClick={toggleMenu} 
              className="md:hidden text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors text-xl flex items-center justify-center"
            >
              {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu - Slides down when open */}
        <div className={`
          md:hidden absolute left-4 right-4 mt-4 bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 transition-all duration-300 transform
          ${isMobileMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-4 opacity-0 invisible'}
        `}>
          <div className="flex flex-col space-y-2">
            <Link to="/products" onClick={toggleMenu} className="text-gray-700 hover:text-blue-600 p-4 rounded-2xl hover:bg-blue-50 transition-colors font-medium">Products</Link>
            <Link to="/customers" onClick={toggleMenu} className="text-gray-700 hover:text-blue-600 p-4 rounded-2xl hover:bg-blue-50 transition-colors font-medium">Customers</Link>
            <Link to="/careers" onClick={toggleMenu} className="text-gray-700 hover:text-blue-600 p-4 rounded-2xl hover:bg-blue-50 transition-colors font-medium">Careers</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;