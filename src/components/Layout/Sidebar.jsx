import React, { useState } from 'react';
import { Menu, Button } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  TagOutlined,
  SnippetsOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo.png';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // 1. FIXED: Retrieve the full user object and extract role from it
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = userData.role || ""; // Extracting 'role' from the parsed object

  // Define all possible menu items with an 'allowedRoles' property
  const allItems = [
    { 
      key: '1', 
      icon: <DashboardOutlined className="text-lg" />, 
      label: <Link to="/Dashboard" className="font-medium">Dashboard</Link>,
      allowedRoles: ['admin', 'employee'] 
    }, 
    { 
      key: '3', 
      icon: <UserOutlined className="text-lg" />, 
      label: <Link to="/Employee" className="font-medium">Employee Directory</Link>,
      allowedRoles: ['admin'] 
    },
    { 
      key: '4', 
      icon: <AppstoreOutlined className="text-lg" />, 
      label: <Link to="/AssetInventory" className="font-medium">Asset Inventory</Link>,
      allowedRoles: ['admin'] 
    },
    { 
      key: '5', 
      icon: <SnippetsOutlined className="text-lg" />, 
      label: <Link to="/TicketQueue" className="font-medium">Ticket Queue</Link>,
      allowedRoles: ['admin', 'employee'] 
    },
    { 
      key: '6', 
      icon: <TagOutlined className="text-lg" />, 
      label: <Link to="/MyAsset" className="font-medium">My Asset</Link>,
      allowedRoles: ['admin', 'employee'] // Usually Admins want to see this too
    },
  ];

  // 2. Filter items based on the user's role
  // This ensures unauthorized links never even render in the DOM
  const filteredItems = allItems.filter(item => 
    item.allowedRoles.includes(userRole)
  );

  return (
    <div className={`flex flex-col h-screen transition-all duration-500 bg-white border-r border-slate-100 shadow-sm ${collapsed ? 'w-20' : 'w-72'}`}>
      
      {/* Logo & Toggle Section */}
      <div className="flex items-center justify-between px-5 h-20 border-b border-slate-50">
        {!collapsed && (
          <Link to="/Dashboard" className="flex items-center gap-2 group shrink-0">
            <div className="flex items-center gap-2 animate-in fade-in duration-500">
              <img src={logo} alt="Logo" style={{height:'40px' ,width:'auto' }} />
              <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent tracking-tight">
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
  );
};

export default Sidebar;