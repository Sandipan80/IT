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
  CustomerServiceOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    { 
      key: '1', 
      icon: <DashboardOutlined className="text-lg" />, 
      label: <Link to="/" className="font-medium">Dashboard</Link>  
    }, 
    { 
      key: '2', 
      icon: <AppstoreOutlined className="text-lg" />, 
      label: <Link to="/users" className="font-medium">Asset Registry</Link> 
    },
    { 
      key: '3', 
      icon: <UserOutlined className="text-lg" />, 
      label: <Link to="/Employee" className="font-medium">Employee Directory</Link>
    },
    { 
      key: '4', 
      icon: <AppstoreOutlined className="text-lg" />, 
      label: <Link to="/AssetInventory" className="font-medium">Asset Inventory</Link>
    },
    { 
      key: '5', 
      icon: <SnippetsOutlined className="text-lg" />, 
      label: <Link to="/TicketQueue" className="font-medium">Ticket Queue</Link>
    },
    { 
      key: '6', 
      icon: <TagOutlined className="text-lg" />, 
      label: <Link to="/MyAsset" className="font-medium">My Asset</Link>
    },
  ];

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const navigate = useNavigate();


  return (
    <div className={`flex flex-col h-screen transition-all duration-500 bg-white border-r border-slate-100 shadow-sm ${collapsed ? 'w-20' : 'w-72'}`}>
      
      {/* Logo & Toggle Section */}
      <div className="flex items-center justify-between px-5 h-20 border-b border-slate-50">
        {!collapsed && (
          <div className="flex items-center gap-2 animate-in fade-in duration-500">
            {/* <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-bold text-xs">MA</span>
            </div> */}
            <span className="text-lg font-bold bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent tracking-tight">
            Asset & Helpdesk            
            </span>
          </div>
        )}
        <Button 
          type="text" 
          onClick={() => setCollapsed(!collapsed)}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          className={`flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors ${collapsed ? 'mx-auto' : ''}`}
        />
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-6 px-3 custom-sidebar-menu">
        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          items={items}
          className="border-none bg-transparent"
        />
      </div>

      {/* Modern Footer Section */}
      <div 
  className="p-6 border-t border-slate-50 mt-auto cursor-pointer hover:opacity-90 transition-all"
  onClick={() => navigate(`/Profile/${userData.id}`)} // 2. Navigation trigger
>
  {!collapsed ? (
    <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-bottom-2 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
        {/* 3. Optional: Initial instead of just an icon */}
        <span className="text-blue-600 font-bold">
          {userData.Name ? userData.Name.charAt(0) : <UserOutlined />}
        </span>
      </div>
      <div className="overflow-hidden">
        {/* 4. Dynamic Name */}
        <p className="text-sm font-bold text-slate-900 truncate">
          {userData.Name || "Guest User"}
        </p>
        {/* 5. Dynamic Employee Code */}
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          {userData.EmployeeCode || "N/A"}
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