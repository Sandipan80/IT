import React, { useState, useEffect } from "react";
import { Table, Button, Input, Tag, Space, Popconfirm, message, Tooltip, Drawer } from "antd";
import { 
  SearchOutlined, UserAddOutlined, EditOutlined, 
  DeleteOutlined, UserOutlined, TeamOutlined 
} from "@ant-design/icons";
import axios from "axios";
import { createPortal } from "react-dom";
import MyForm from "./User"; // Ensure this matches your filename for the form

const Users = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Sync animation state for smooth Drawer transitions
  useEffect(() => {
    if (showForm) {
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [showForm]);

  /**
   * FETCH EMPLOYEES
   * Calls the .populate('Assets') backend route to get full asset details
   */
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/EmployeeRoute/GetUser");
      setData(res?.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      message.error("Failed to load employee directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // --- DELETE LOGIC ---
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/EmployeeRoute/DeleteUser/${id}`);
      message.success("Employee removed and assets unassigned");
      fetchEmployees();
    } catch (err) {
      message.error("Delete operation failed");
    }
  };

  // --- EDIT LOGIC ---
  const handleEdit = (employee) => {
    setEditingUser(employee);
    setShowForm(true);
  };

  const filteredEmployees = data?.employeeList?.filter((emp) =>
    emp.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.Department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.EmployeeCode?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // --- TABLE COLUMN DEFINITIONS ---
  const columns = [
    {
      title: "EMPLOYEE INFO",
      key: "info",
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{record.Name}</span>
          <span className="text-xs text-slate-400">{record.Email}</span>
        </div>
      ),
    },
    {
      title: "INTERNAL CODE",
      dataIndex: "EmployeeCode",
      key: "EmployeeCode",
      render: (code) => (
        <Tag className="bg-slate-50 border-slate-200 text-slate-600 font-medium">
          {code}
        </Tag>
      ),
    },
    {
      title: "POSITION",
      key: "position",
      render: (_, record) => (
        <div>
          <div className="text-sm font-semibold text-slate-700">{record.Department || "N/A"}</div>
          <div className="text-xs text-slate-400 italic">{record.Role}</div>
        </div>
      ),
    },
    {
      title: "ASSETS ASSIGNED",
      dataIndex: "Assets",
      key: "Assets",
      render: (assets) => (
        <div className="flex flex-wrap gap-1">
          {Array.isArray(assets) && assets.length > 0 ? (
            assets.map((asset, i) => (
              <Tag key={i} color="blue" className="text-[10px] uppercase font-bold px-1 py-0 border-blue-200">
                {typeof asset === 'object' ? asset.name : 'Asset'}
              </Tag>
            ))
          ) : (
            <span className="text-xs text-slate-300 italic">None</span>
          )}
        </div>
      ),
    },
    {
      title: "ACTIONS",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit Employee">
            <Button 
              type="text" 
              icon={<EditOutlined className="text-blue-500" />} 
              onClick={() => handleEdit(record)} 
            />
          </Tooltip>
          <Popconfirm
            title="Delete Employee?"
            description="All assigned assets will be marked as unassigned."
            onConfirm={() => handleDelete(record._id)}
            okText="Delete"
            okType="danger"
          >
            <Tooltip title="Delete">
              <Button type="text" icon={<DeleteOutlined className="text-red-500" />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
              <TeamOutlined className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Employee Directory</h1>
              <p className="text-slate-400 text-sm font-medium">{data?.message || 'Fetching real-time data...'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Input
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Search name, code..."
              className="rounded-xl border-slate-200 h-11 w-full md:w-64"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              type="primary" 
              size="large" 
              icon={<UserAddOutlined />}
              onClick={() => { setEditingUser(null); setShowForm(true); }}
              className="bg-blue-600 hover:bg-blue-700 border-none rounded-xl h-11 shadow-lg shadow-blue-100 font-bold"
            >
              Add Employee
            </Button>
          </div>
        </div>

        {/* --- MAIN DATA TABLE --- */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <Table
            columns={columns}
            dataSource={filteredEmployees}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 8 }}
            className="custom-table"
            // Styles the table header to match your Gen-Z aesthetic
            rowClassName="hover:bg-blue-50/50 transition-colors"
          />
        </div>

        {/* --- PORTAL DRAWER --- */}
        {showForm && createPortal(
          <div className="fixed inset-0 z-50 flex justify-end">
            <div 
              className={`absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] transition-opacity duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0'}`} 
              onClick={() => setShowForm(false)} 
            />
            <div className={`relative w-full max-w-lg bg-white h-full shadow-2xl transition-transform duration-500 ease-out ${isAnimating ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 text-white rounded-lg"><UserOutlined /></div>
                  <h2 className="text-xl font-bold text-slate-800">{editingUser ? 'Update Employee' : 'New Registration'}</h2>
                </div>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">✕</button>
              </div>
              <div className="p-8 overflow-y-auto h-[calc(100%-80px)]">
                <MyForm 
                  initialData={editingUser} 
                  onSuccess={() => { setShowForm(false); fetchEmployees(); }} 
                />
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};

export default Users;