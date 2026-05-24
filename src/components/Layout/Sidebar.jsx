import React, { useState } from "react";
import { Menu, Dropdown, Divider } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  TagOutlined,
  SnippetsOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/Logo.png";
import Cookies from "js-cookie";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to listen to URL changes for the "Active Tab" label

  // --- 1. USER DATA & AUTH LOGIC ---
  // We retrieve the user object from cookies to handle role-based access and profile info
  const userData = JSON.parse(Cookies.get("user") || "{}");
  const userRole = userData.role || "";

  // --- 2. MENU CONFIGURATION ---
  // Centralized list of all links. 'key' matches the URL path for easy active-state detection.
  const navigationItems = [
    {
      key: "/Dashboard",
      icon: <DashboardOutlined className="text-lg" />,
      label: (
        <Link to="/Dashboard" className="font-medium">
          Dashboard
        </Link>
      ),
      allowedRoles: ["admin", "employee"],
      title: "Dashboard",
    },
    {
      key: "/Employee",
      icon: <UserOutlined className="text-lg" />,
      label: (
        <Link to="/Employee" className="font-medium">
          Employee Directory
        </Link>
      ),
      allowedRoles: ["admin"],
      title: "Employees",
    },
    {
      key: "/AssetInventory",
      icon: <AppstoreOutlined className="text-lg" />,
      label: (
        <Link to="/AssetInventory" className="font-medium">
          Asset Inventory
        </Link>
      ),
      allowedRoles: ["admin"],
      title: "Inventory",
    },
    {
      key: "/TicketQueue",
      icon: <SnippetsOutlined className="text-lg" />,
      label: (
        <Link to="/TicketQueue" className="font-medium">
          Ticket Queue
        </Link>
      ),
      allowedRoles: ["admin", "employee"],
      title: "Tickets",
    },
    {
      key: "/AvailableAssets",
      icon: <TagOutlined className="text-lg" />,
      label: (
        <Link to="/AvailableAssets" className="font-medium">
          Available Asset
        </Link>
      ),
      allowedRoles: ["admin", "employee"],
      title: "Available",
    },
    {
      key: "/AssetRequestPanel",
      icon: <AppstoreOutlined className="text-lg" />,
      label: (
        <Link to="/AssetRequestPanel" className="font-medium">
          Asset Requests
        </Link>
      ),
      allowedRoles: ["admin"],
      title: "Requests",
    },
  ];

  // Filter out links that the current user is not allowed to see based on their role
  const filteredNav = navigationItems.filter((item) =>
    item.allowedRoles.includes(userRole),
  );

  // --- 3. MOBILE SPECIFIC ITEMS ---
  // We add a special Profile section at the top of the mobile dropdown menu
  const mobileMenuItems = [
    {
      key: "profile",
      label: (
        <div
          className="flex items-center gap-3 py-2"
          onClick={() => navigate(`/Profile/${userData.id}`)}
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            {userData.Name ? (
              userData.Name.charAt(0).toUpperCase()
            ) : (
              <UserOutlined />
            )}
          </div>
          <div>
            <p className="text-xs font-bold leading-none">
              {userData.Name || "User"}
            </p>
            <p className="text-[10px] text-blue-600 uppercase font-bold mt-1">
              {userRole}
            </p>
          </div>
        </div>
      ),
    },
    { type: "divider" }, // Visual separator between Profile and Nav links
    ...filteredNav,
  ];

  // Detect which page the user is currently on to display the title in the top-bar
  const activeTab =
    navigationItems.find((item) => item.key === location.pathname)?.title ||
    "Vault";

  return (
    <>
      {/* --- COMPONENT A: MOBILE NAVBAR (md:hidden) ---
          Visible on mobile/tablets. Switches from side to top to save horizontal space.
      */}
      <div className="flex md:hidden items-center justify-between px-4 h-16 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50 w-full shrink-0">
        {/* Mobile Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          <span className="text-md font-bold text-slate-900">Vault</span>
        </Link>

        {/* Dynamic Center Label (Tells user where they are) */}
        <div className="text-blue-600 font-bold text-[10px] bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">
          {activeTab}
        </div>

        {/* Mobile Profile Avatar & Hamburger Menu */}
        <div className="flex items-center gap-2">
          <div
            onClick={() => navigate(`/Profile/${userData.id}`)}
            className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm cursor-pointer"
          >
            {userData.Name ? (
              userData.Name.charAt(0).toUpperCase()
            ) : (
              <UserOutlined />
            )}
          </div>

          <Dropdown
            menu={{ items: mobileMenuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-600">
              <MenuOutlined />
            </button>
          </Dropdown>
        </div>
      </div>

      {/* --- COMPONENT B: DESKTOP SIDEBAR (hidden md:flex) ---
          Visible on screens 768px and wider. Features the collapsible transition.
      */}
      <div
        className={`hidden md:flex flex-col h-screen transition-all duration-500 bg-slate-900 border-r border-slate-800 shadow-sm text-white ${collapsed ? "w-20" : "w-72"}`}
      >
        {/* Header: Logo and the Collapse Toggle Button */}
        <div className="flex items-center justify-between px-5 h-20 border-b border-slate-800">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="flex items-center gap-2">
                <img
                  src={logo}
                  alt="Logo"
                  style={{ height: "40px", width: "auto" }}
                />
                {/* Changed gradient to light colors to show up on dark background */}
                <span className="text-lg font-bold bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Vault
                </span>
              </div>
            </Link>
          )}
          {/* Lightened the hover color slightly for better dark mode contrast */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-blue-400"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>

        {/* Main Navigation: Scrollable area for menu links */}
        <div className="flex-1 py-6 px-3 overflow-y-auto">
          <Menu
            mode="inline"
            theme="dark" /* Added this if you are using Ant Design to make the menu items dark */
            inlineCollapsed={collapsed}
            selectedKeys={[location.pathname]}
            items={filteredNav}
            className="border-none bg-transparent"
          />
        </div>

        {/* Footer: Full Desktop Profile Card (Hides/Shrinks on Collapse) */}
        <div
          className="p-4 border-t border-slate-800 mt-auto cursor-pointer hover:bg-slate-800/50 transition-all"
          onClick={() => navigate(`/Profile/${userData.id}`)}
        >
          {!collapsed ? (
            // Changed from bg-slate-50 to bg-slate-800
            <div className="bg-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-600 shadow-sm flex items-center justify-center text-white font-bold shrink-0">
                {userData.Name ? (
                  userData.Name.charAt(0).toUpperCase()
                ) : (
                  <UserOutlined />
                )}
              </div>
              <div className="overflow-hidden">
                {/* Changed text-slate-900 to text-white */}
                <p className="text-sm font-bold text-white truncate">
                  {userData.Name || "User"}
                </p>
                {/* Lightened the blue role text for better contrast */}
                <p className="text-[10px] text-blue-400 uppercase tracking-widest font-extrabold">
                  {userRole}
                </p>
              </div>
            </div>
          ) : (
            // Changed collapsed background from bg-slate-50 to bg-slate-800
            <div className="mx-auto w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
