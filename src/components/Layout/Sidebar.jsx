import React, { useState } from 'react';
import { Menu, Dropdown } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  TagOutlined,
  SnippetsOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/Logo.png';
import Cookies from 'js-cookie';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 1. FIXED: Retrieve the full user object and extract role from it
  const userData = JSON.parse(Cookies.get("user") || "{}");
  const userRole = userData.role || ""; 

  // Define menu items with 'key' matching the path for 'active tab' detection
  const allItems = [
    { 
      key: '/Dashboard', 
      icon: <DashboardOutlined className="text-lg" />, 
      label: <Link to="/Dashboard" className="font-medium">Dashboard</Link>,
      allowedRoles: ['admin', 'employee'],
      title: "Dashboard"
    }, 
    { 
      key: '/Employee', 
      icon: <UserOutlined className="text-lg" />, 
      label: <Link to="/Employee" className="font-medium">Employee Directory</Link>,
      allowedRoles: ['admin'],
      title: "Employees"
    },
    { 
      key: '/AssetInventory', 
      icon: <AppstoreOutlined className="text-lg" />, 
      label: <Link to="/AssetInventory" className="font-medium">Asset Inventory</Link>,
      allowedRoles: ['admin'],
      title: "Inventory"
    },
    { 
      key: '/TicketQueue', 
      icon: <SnippetsOutlined className="text-lg" />, 
      label: <Link to="/TicketQueue" className="font-medium">Ticket Queue</Link>,
      allowedRoles: ['admin', 'employee'],
      title: "Tickets"
    },
    { 
      key: '/AvailableAssets', 
      icon: <TagOutlined className="text-lg" />, 
      label: <Link to="/AvailableAssets" className="font-medium">Available Asset</Link>,
      allowedRoles: ['admin', 'employee'],
      title: "Available"
    },
    { 
      key: '/AssetRequestPanel', 
      icon: <AppstoreOutlined className="text-lg" />, 
      label: <Link to="/AssetRequestPanel" className="font-medium">Asset Requests</Link>,
      allowedRoles: ['admin'],
      title: "Requests"
    },
  ];

  // 2. Filter items based on user role
  const filteredItems = allItems.filter(item => 
    item.allowedRoles.includes(userRole)
  );

  // Logic to show which tab is open in the mobile header
  const activeTab = allItems.find(item => item.key === location.pathname)?.title || "Vault";

  return (
    <>
      {/* MOBILE NAVBAR: Visible only on small screens (md:hidden) */}
      <div className="flex md:hidden items-center justify-between px-4 h-16 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50 w-full shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          <span className="text-md font-bold text-slate-900">Vault</span>
        </Link>

        {/* This fills the gap between logo and menu icon with the current page name */}
        <div className="text-blue-600 font-bold text-[11px] bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">
          {activeTab}
        </div>

        <Dropdown 
          menu={{ items: filteredItems }} 
          trigger={['click']}
          placement="bottomRight"
        >
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 shadow-inner">
            <MenuOutlined className="text-lg" />
          </button>
        </Dropdown>
      </div>

      {/* DESKTOP SIDEBAR: Hidden on mobile (hidden md:flex) */}
      <div className={`hidden md:flex flex-col h-screen transition-all duration-500 bg-white border-r border-slate-100 shadow-sm ${collapsed ? 'w-20' : 'w-72'}`}>
        
        {/* Logo & Toggle Section */}
        <div className="flex items-center justify-between px-5 h-20 border-b border-slate-50">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="flex items-center gap-2 animate-in fade-in duration-500">
                <img src={logo} alt="Logo" style={{height:'40px' ,width:'auto' }} />
                <span className="text-lg font-bold bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent tracking-tight">
                  Vault            
                </span>
              </div>
            </Link>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center justify-center w-8 h-8 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors ${collapsed ? 'mx-auto' : ''}`}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 py-6 px-3 custom-sidebar-menu overflow-y-auto">
          <Menu
            mode="inline"
            inlineCollapsed={collapsed}
            selectedKeys={[location.pathname]} 
            items={filteredItems} 
            className="border-none bg-transparent"
          />
        </div>

        {/* Footer / Profile Section */}
        <div 
          className="p-4 border-t border-slate-50 mt-auto cursor-pointer hover:bg-slate-50/50 transition-all"
          onClick={() => navigate(`/Profile/${userData.id}`)}
        >
          {!collapsed ? (
            <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-bottom-2 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-600 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                <span className="text-white font-bold">
                  {userData.Name ? userData.Name.charAt(0).toUpperCase() : <UserOutlined />}
                </span>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {userData.Name || "User"}
                </p>
                <p className="text-[10px] text-blue-600 uppercase tracking-widest font-extrabold">
                  {userRole || "Access Denied"}
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;