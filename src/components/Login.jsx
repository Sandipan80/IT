import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

const LoginPage = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      // Sends { Email: "...", EmployeeCode: "..." } to your backend
      const response = await axios.post("http://localhost:5000/api/LoginRoute/Login", values);
      
      // Save the token for protected routes
      localStorage.setItem("token", response.data.token);
      // Example in your Login UI logic
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      message.success("Login Successful!");
      window.location.href = "/Dashboard"; 
    } catch (err) {
      // Displays the specific error from your Express backend or a fallback message
      const errorMsg = err.response?.data?.message || "Login Failed. Please check your credentials.";
      message.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl w-full flex bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Left Side - Branding Section */}
        <div className="hidden md:flex md:w-5/12 bg-indigo-700 p-12 text-white flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">AssetSwift</h2>
            <div className="h-1 w-12 bg-indigo-400 mt-2 rounded-full"></div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Internal Portal</h3>
            <p className="text-indigo-100 leading-relaxed">
              Securely manage office inventory and track IT assets across all departments.
            </p>
          </div>

          <div className="text-xs text-indigo-300 italic">
            v2.4.0 — Authorized Access Only
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-7/12 p-10 lg:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
            <p className="text-gray-400 mt-1">Enter your credentials to continue</p>
          </div>

          <Form
            form={form}
            name="asset_login"
            layout="vertical"
            onFinish={onFinish}
            size="large"
            requiredMark={false}
          >
            {/* Email Field */}
            <Form.Item
              name="Email"
              label={<span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Email Address</span>}
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400 mr-2" />} 
                placeholder="name@company.com" 
                className="rounded-lg h-12 border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
              />
            </Form.Item>

            {/* Employee Code Field (Replacing Password) */}
            <Form.Item
              name="EmployeeCode"
              label={<span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Employee Code</span>}
              rules={[
                { required: true, message: 'Employee Code is required' },
                { whitespace: true, message: 'Code cannot be empty' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400 mr-2" />}
                placeholder="••••••••"
                className="rounded-lg h-12 border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
              />
            </Form.Item>

            <Form.Item className="mt-8">
              <Button 
                type="primary" 
                htmlType="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 border-none h-12 rounded-lg font-bold text-base shadow-md transition-all active:scale-[0.98]"
              >
                Access Dashboard
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              For security reasons, contact the IT department to reset credentials or create a new account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;