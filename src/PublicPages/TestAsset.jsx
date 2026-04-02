import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Form, Input, Select, message, Badge } from 'antd';
import { PlusOutlined, FileTextOutlined, SearchOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { createPortal } from 'react-dom';
import axios from 'axios';

const TicketQueue = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [form] = Form.useForm();

  // Get user info for RBAC and auto-filling
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = userData.role === 'admin';

  // Handle Animation State
  useEffect(() => {
    if (showForm) {
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [showForm]);

  // Fetch Tickets
  const fetchTickets = async () => {
    setLoading(true);
    try {
      // Admins see all, employees see only theirs
      const url = isAdmin 
        ? "http://localhost:5000/api/TicketRoute/GetAll" 
        : `http://localhost:5000/api/TicketRoute/GetByUser/${userData.id}`;
      const res = await axios.get(url);
      setTickets(res.data.tickets || []);
    } catch (error) {
      message.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  // Submit Ticket
  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        raisedBy: userData.id,
        employeeName: userData.Name
      };
      await axios.post("http://localhost:5000/api/TicketRoute/Create", payload);
      message.success("Ticket raised successfully!");
      setShowForm(false);
      form.resetFields();
      fetchTickets();
    } catch (error) {
      message.error("Error raising ticket");
    }
  };

  const columns = [
    {
      title: 'Ticket ID',
      dataIndex: 'ticketId',
      key: 'ticketId',
      render: (text) => <span className="font-mono font-bold text-blue-600">{text}</span>,
    },
    {
      title: 'Issue Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (text, record) => (
        <div>
          <div className="font-semibold text-slate-900">{text}</div>
          <div className="text-xs text-slate-400">{record.category}</div>
        </div>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        let color = priority === 'High' ? 'volcano' : priority === 'Medium' ? 'orange' : 'green';
        return <Tag color={color} className="rounded-full px-3">{priority.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge status={status === 'Open' ? 'processing' : 'success'} text={status} />
      ),
    },
    {
      title: 'Raised By',
      dataIndex: 'employeeName',
      key: 'employeeName',
      hidden: !isAdmin, // Only show to admin
    }
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">IT Ticket Queue</h1>
            <p className="text-slate-500 text-sm">Monitor and resolve IT support requests</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            <PlusOutlined /> Raise Ticket
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ClockCircleOutlined className="text-xl"/></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Pending Tickets</p>
              <p className="text-2xl font-bold text-slate-900">{tickets.filter(t => t.status === 'Open').length}</p>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <Table 
            columns={columns} 
            dataSource={tickets} 
            loading={loading}
            rowKey="_id"
            className="custom-table"
            pagination={{ pageSize: 8 }}
          />
        </div>
      </div>

      {/* Slide-in Form Drawer */}
      {showForm && createPortal(
        <div className="fixed inset-0 z-[10000] flex justify-end">
          <div 
            className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setShowForm(false)}
          />
          <div className={`relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isAnimating ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Raise Support Ticket</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><PlusOutlined className="rotate-45 text-xl"/></button>
            </div>

            <div className="flex-1 p-8 overflow-y-auto">
              <Form form={form} layout="vertical" onFinish={onFinish} id="ticket-form">
                <Form.Item name="subject" label="Issue Subject" rules={[{ required: true, message: 'What is the issue?' }]}>
                  <Input placeholder="e.g. Laptop not turning on" className="rounded-lg py-2" />
                </Form.Item>
                
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                    <Select placeholder="Select Type" className="rounded-lg">
                      <Select.Option value="Hardware">Hardware</Select.Option>
                      <Select.Option value="Software">Software</Select.Option>
                      <Select.Option value="Network">Network</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
                    <Select placeholder="Urgency">
                      <Select.Option value="Low">Low</Select.Option>
                      <Select.Option value="Medium">Medium</Select.Option>
                      <Select.Option value="High">High</Select.Option>
                    </Select>
                  </Form.Item>
                </div>

                <Form.Item name="description" label="Detailed Description" rules={[{ required: true }]}>
                  <Input.TextArea rows={4} placeholder="Describe the problem in detail..." className="rounded-lg" />
                </Form.Item>
              </Form>
            </div>

            <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
              <Button onClick={() => setShowForm(false)} type="text" className="font-semibold text-slate-500">Cancel</Button>
              <Button type="primary" form="ticket-form" htmlType="submit" className="bg-blue-600 h-10 px-8 rounded-xl font-bold">
                Submit Ticket
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default TicketQueue;