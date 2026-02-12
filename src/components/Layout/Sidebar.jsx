import React, { useState } from 'react';
import { Menu, Button } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    { 
      key: '1', 
      icon: <DashboardOutlined className="text-lg" />, 
      label: <span className="font-medium">Dashboard</span> 
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
  ];

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
      <div className="p-6 border-t border-slate-50 mt-auto">
        {!collapsed ? (
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-bottom-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center">
              <UserOutlined className="text-blue-600" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">Admin User</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">System Admin</p>
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