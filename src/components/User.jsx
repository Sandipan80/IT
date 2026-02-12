import React from 'react';
import { Button, Form, Input, Card, message } from 'antd'; // Added message for better feedback
import axios from 'axios';

const MyForm = () => {
  // 1. Initialize the form instance
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/api/Assets/newasset', values);
      console.log('Success:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      // 2. Success Feedback
      message.success('Employee Registered Successfully!');
      
      // 3. Reset the form fields to their initial values
      form.resetFields();

    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      message.error('Registration Failed: ' + (error.response?.data?.message || 'Server Error'));
    }
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Asset Management System
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Register a new employee and allocate resources
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl animate-in fade-in zoom-in-95 duration-1000 delay-200">
        <Card className="shadow-xl border-slate-200 rounded-2xl overflow-hidden">
          <Form
            form={form} // 4. Attach the form instance here
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="space-y-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Form.Item
                label={<span className="font-semibold text-slate-700">Full Name</span>}
                name="Name"
                rules={[{ required: true, message: 'Please input Employee Name!' }]}
              >
                <Input className="rounded-lg py-2 hover:border-blue-400 focus:border-blue-500 transition-all" placeholder="John Doe" />
              </Form.Item>

              <Form.Item
                label={<span className="font-semibold text-slate-700">Employee Code</span>}
                name="EmployeeCode"
                rules={[{ required: true, message: 'Please input your Employee-Code!' }]}
              >
                <Input className="rounded-lg py-2" placeholder="EMP-001" />
              </Form.Item>
            </div>

            <Form.Item
              label={<span className="font-semibold text-slate-700">Email Address</span>}
              name="Email"
              rules={[{ required: true, message: 'Please input Employee Email!' }]}
            >
              <Input className="rounded-lg py-2" placeholder="john@company.com" />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Form.Item
                label={<span className="font-semibold text-slate-700">Department</span>}
                name="Department"
                rules={[{ required: true, message: 'Please input Employee Department!' }]}
              >
                <Input className="rounded-lg py-2" placeholder="e.g. Engineering" />
              </Form.Item>

              <Form.Item
                label={<span className="font-semibold text-slate-700">Job Role</span>}
                name="Role"
                rules={[{ required: true, message: 'Please input Employee Role!' }]}
              >
                <Input className="rounded-lg py-2" placeholder="e.g. Developer" />
              </Form.Item>
            </div>

            <Form.Item
              label={<span className="font-semibold text-slate-700">Assets to Allocate</span>}
              name="Assets"
              rules={[{ required: true, message: 'Please input Employee Assets!' }]}
              tooltip="Enter assets separated by commas"
            >
              <Input.TextArea rows={2} className="rounded-lg" placeholder="MacBook Pro, Dell Monitor" />
            </Form.Item>

            <Form.Item className="pt-4">
              <Button 
                type="primary" 
                htmlType="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-lg font-medium rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                Register & Assign Assets
              </Button>
            </Form.Item>
          </Form>
        </Card>
        
        <p className="mt-8 text-center text-xs text-slate-400 uppercase tracking-widest">
          Secure Asset Management Portal &copy; 2026
        </p>
      </div>
    </div>
  );
};

export default MyForm;