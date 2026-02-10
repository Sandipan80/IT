import React, { useState } from 'react';
import { Menu, Button } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Menu items configuration
  const items = [
    { key: '1', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '2', icon: <UserOutlined />, label: 'Users' },
    { key: '2', icon: <UserOutlined />, label: 'Users' },
    { key: '3', icon: <SettingOutlined />, label: 'Settings' },
  ];

  return (
    <div className={`flex flex-col h-screen transition-all duration-300 border-r border-gray-200 bg-white ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 h-16">
        {!collapsed && <span className="text-xl font-bold text-blue-600">MY APP</span>}
        <Button 
          type="text" 
          onClick={() => setCollapsed(!collapsed)}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          className="hover:bg-gray-100"
        />
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto">
        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          items={items}
          className="border-none"
        />
      </div>

      {/* Optional Footer */}
      <div className="p-4 border-t border-gray-100 text-center">
        {!collapsed && <p className="text-xs text-gray-400">v1.0.0</p>}
      </div>
    </div>
  );
};

export default Sidebar;