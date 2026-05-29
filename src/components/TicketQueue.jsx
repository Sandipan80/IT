import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Form,
  Input,
  Select,
  message,
  Badge,
  Tooltip,
  Radio,
} from "antd";
import {
  PlusOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  InboxOutlined,
  UserOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { createPortal } from "react-dom";
import axiosInstance from "../../utils/axiosInstance";
import Cookies from "js-cookie";

const { Option } = Select;

const TicketQueue = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Slide-in Form Drawers Control States
  const [showForm, setShowForm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [isAssignAnimating, setIsAssignAnimating] = useState(false);
  
  const [employees, setEmployees] = useState([]);
  const [currentTab, setCurrentTab] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState(null); // Holds ticket object for assignment context
  
  const [form] = Form.useForm();
  const [assignForm] = Form.useForm();

  const userData = JSON.parse(Cookies.get("user") || "{}");
  const isAdmin = userData.role === "admin";

  // Handles animation states for standard Raise Ticket Drawer
  useEffect(() => {
    if (showForm) {
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [showForm]);

  // Handles animation states for Assignment Drawer
  useEffect(() => {
    if (showAssignForm) {
      const timer = setTimeout(() => setIsAssignAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAssignAnimating(false);
    }
  }, [showAssignForm]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const url = isAdmin
        ? "/TicketRoute/getAllTickets"
        : `/TicketRoute/getTicketsByUser/${userData.id}`;

      const res = await axiosInstance.get(url);
      setTickets(res.data.tickets || []);
    } catch (error) {
      message.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeesForAssignment = async () => {
    if (!isAdmin) return;
    try {
      const res = await axiosInstance.get("/EmployeeRoute/GetUser");
      setEmployees(res?.data?.employeeList || []);
    } catch (error) {
      console.error("Error fetching employees for dropdown:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchEmployeesForAssignment();
  }, []);

  // Triggered when clicking "Assign Task" button inside the data row table
  const openAssignmentDrawer = (ticketRecord) => {
    setSelectedTicket(ticketRecord);
    assignForm.setFieldsValue({
      ticketIdDisplay: ticketRecord.ticketId,
      subjectDisplay: ticketRecord.subject,
    });
    setShowAssignForm(true);
  };

  // Submission handler executing inside the right-hand slide-out drawer layout
  const onFinishAssignment = async (values) => {
    try {
      const targetEmployee = employees.find(emp => emp._id === values.employeeId);
      const employeeName = targetEmployee ? targetEmployee.Name : "IT Specialist";

      await axiosInstance.put(`/TicketRoute/assignTicket/${selectedTicket._id}`, {
        employeeId: values.employeeId,
        employeeName: employeeName,
        instructions: values.instructions || "No specific instructions provided.",
      });

      message.success(`Ticket successfully assigned to ${employeeName}`);
      setShowAssignForm(false);
      assignForm.resetFields();
      setSelectedTicket(null);
      fetchTickets();
    } catch (error) {
      console.error(error);
      message.error("Failed to complete work pipeline assignment");
    }
  };

  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        raisedBy: userData.id,
        employeeName: userData.Name || "Employee",
      };
      await axiosInstance.post("/TicketRoute/CreateTicket", payload);
      message.success("Ticket raised successfully!");
      setShowForm(false);
      form.resetFields();
      fetchTickets();
    } catch (error) {
      message.error("Error raising ticket");
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (currentTab === "All") return true;
    if (currentTab === "Open") return ticket.status === "Open";
    if (currentTab === "In Progress") return ticket.status === "In Progress";
    if (currentTab === "Resolved") return ticket.status === "Resolved" || ticket.status === "Completed";
    return true;
  });

  const columns = [
    {
      title: "TICKET ID",
      dataIndex: "ticketId",
      key: "ticketId",
      render: (text) => (
        <span className="font-mono font-black text-blue-600 tracking-wider bg-blue-50/60 px-2.5 py-1 rounded-lg border border-blue-100 text-xs">
          {text}
        </span>
      ),
    },
    {
      title: "ISSUE SUBJECT",
      dataIndex: "subject",
      key: "subject",
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 text-sm">{text}</span>
          <span className="text-xs text-slate-400 font-medium mt-0.5">
            Category: <Tag className="text-[10px] font-bold py-0 px-1.5 uppercase border-slate-200 bg-slate-50 text-slate-500">{record.category}</Tag>
          </span>
        </div>
      ),
    },
    {
      title: "PRIORITY",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => {
        let color = priority === "High" ? "volcano" : priority === "Medium" ? "orange" : "green";
        return (
          <Tag color={color} className="rounded-full px-3 text-xs font-semibold uppercase tracking-wider">
            {priority}
          </Tag>
        );
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let badgeStatus = "default";
        if (status === "Open") badgeStatus = "processing";
        if (status === "In Progress") badgeStatus = "warning";
        if (status === "Resolved" || status === "Completed") badgeStatus = "success";
        
        return (
          <Badge 
            status={badgeStatus} 
            text={<span className="text-sm font-medium text-slate-700">{status}</span>} 
          />
        );
      },
    },
    {
      title: "RAISED BY",
      dataIndex: "employeeName",
      key: "employeeName",
      hidden: !isAdmin,
      render: (text) => <span className="text-slate-600 font-medium text-sm">{text || "User"}</span>
    },
    {
      title: "ASSIGNMENT ACTION",
      key: "action",
      hidden: !isAdmin,
      align: "right",
      render: (_, record) => {
        if (record.status === "Open") {
          return (
            <Button
              type="primary"
              size="middle"
              icon={<UserOutlined />}
              onClick={() => openAssignmentDrawer(record)}
              className="bg-blue-600 hover:bg-blue-700 border-none rounded-xl font-bold flex items-center shadow-md shadow-blue-50 transition-all transform hover:scale-[1.02]"
            >
              Assign Task
            </Button>
          );
        }
        
        return (
          <span className="text-emerald-600 font-bold text-xs bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 shadow-sm shadow-emerald-50 animate-in fade-in zoom-in-95 duration-300">
            <Badge status="success" className="m-0 p-0" /> {record.assignedToName || "IT Specialist"}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen w-full overflow-x-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Section */}
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              IT Ticket Queue
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              Monitor, assign, and resolve enterprise infrastructure requests
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Tooltip title="Refresh Tickets">
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchTickets}
                loading={loading}
                className="rounded-xl h-11 w-11 flex items-center justify-center border-slate-200 text-slate-500 hover:text-blue-600 shadow-sm bg-white"
              />
            </Tooltip>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 h-11 rounded-xl font-bold shadow-md shadow-blue-100 transition-all active:scale-95 whitespace-nowrap text-sm"
            >
              <PlusOutlined /> Raise Support Request
            </button>
          </div>
        </div>

        {/* Metric Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-slate-50 text-slate-500 rounded-xl"><InboxOutlined className="text-xl" /></div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Backlog</p>
              <p className="text-2xl font-black text-slate-900">{tickets.length}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ClockCircleOutlined className="text-xl" /></div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Open Queue</p>
              <p className="text-2xl font-black text-blue-600">{tickets.filter((t) => t.status === "Open").length}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><SyncOutlined className="text-xl" /></div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">In Progress</p>
              <p className="text-2xl font-black text-amber-600">{tickets.filter((t) => t.status === "In Progress").length}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircleOutlined className="text-xl" /></div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Resolved</p>
              <p className="text-2xl font-black text-emerald-600">{tickets.filter((t) => t.status === "Resolved" || t.status === "Completed").length}</p>
            </div>
          </div>
        </div>

        {/* Tab Selection Filter Controls */}
        <div className="bg-slate-200/50 p-1.5 rounded-2xl inline-flex border border-slate-200 shadow-inner">
          <Radio.Group 
            value={currentTab} 
            onChange={(e) => setCurrentTab(e.target.value)}
            buttonStyle="solid"
            className="flex gap-1"
          >
            <Radio.Button value="All" className="border-none rounded-xl font-bold px-5 text-sm h-9 flex items-center transition-all bg-transparent shadow-none hover:text-blue-600">
              All Tickets ({tickets.length})
            </Radio.Button>
            <Radio.Button value="Open" className="border-none rounded-xl font-bold px-5 text-sm h-9 flex items-center transition-all bg-transparent shadow-none hover:text-blue-600">
              Open ({tickets.filter(t => t.status === "Open").length})
            </Radio.Button>
            <Radio.Button value="In Progress" className="border-none rounded-xl font-bold px-5 text-sm h-9 flex items-center transition-all bg-transparent shadow-none hover:text-blue-600">
              In Progress ({tickets.filter(t => t.status === "In Progress").length})
            </Radio.Button>
            <Radio.Button value="Resolved" className="border-none rounded-xl font-bold px-5 text-sm h-9 flex items-center transition-all bg-transparent shadow-none hover:text-blue-600">
              Resolved ({tickets.filter(t => t.status === "Resolved" || t.status === "Completed").length})
            </Radio.Button>
          </Radio.Group>
        </div>

        {/* Main Application Data Grid */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden w-full overflow-x-auto">
          <Table
            columns={columns.filter(col => !col.hidden)}
            dataSource={filteredTickets}
            loading={loading}
            rowKey="_id"
            className="custom-table min-w-full"
            pagination={{ pageSize: 7 }}
            rowClassName={() => "hover:bg-slate-50/60 transition-colors border-b border-slate-100"}
          />
        </div>
      </div>

      {/* --- PORTAL DRAWER ONE: RAISE TICKET --- */}
      {showForm &&
        createPortal(
          <div className="fixed inset-0 z-100 flex justify-end">
            <div
              className={`absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] transition-opacity duration-500 ${isAnimating ? "opacity-100" : "opacity-0"}`}
              onClick={() => setShowForm(false)}
            />
            <div
              className={`relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-500 ease-out ${isAnimating ? "translate-x-0" : "translate-x-full"}`}
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 text-white rounded-lg flex items-center justify-center"><FileTextOutlined /></div>
                  <h2 className="text-xl font-bold text-slate-800">Raise Support Ticket</h2>
                </div>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">✕</button>
              </div>

              <div className="flex-1 p-8 overflow-y-auto">
                <Form form={form} layout="vertical" onFinish={onFinish} id="ticket-form">
                  <Form.Item name="subject" label="Issue Subject" rules={[{ required: true, message: "What is the issue?" }]}>
                    <Input placeholder="e.g. Laptop not turning on" className="rounded-xl py-2" />
                  </Form.Item>
                  <Form.Item name="description" label="Detailed Description" rules={[{ required: true }]}>
                    <Input.TextArea rows={4} placeholder="Describe the problem in detail..." className="rounded-xl" />
                  </Form.Item>

                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item name="category" label="Category" rules={[{ required: true, message: "Select a category" }]}>
                      <Select placeholder="Select Type" className="w-full" getPopupContainer={(trigger) => trigger.parentNode}>
                        <Option value="Hardware">Hardware</Option>
                        <Option value="Software">Software</Option>
                        <Option value="Network">Network</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item name="priority" label="Priority" rules={[{ required: true, message: "Select priority" }]}>
                      <Select placeholder="Urgency" className="w-full" getPopupContainer={(trigger) => trigger.parentNode}>
                        <Option value="Low">Low</Option>
                        <Option value="Medium">Medium</Option>
                        <Option value="High">High</Option>
                      </Select>
                    </Form.Item>
                  </div>
                </Form>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0">
                <Button onClick={() => setShowForm(false)} type="text" className="font-semibold text-slate-500">Cancel</Button>
                <Button type="primary" form="ticket-form" htmlType="submit" className="bg-blue-600 h-10 px-8 rounded-xl font-bold border-none">Submit Ticket</Button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* --- PORTAL DRAWER TWO: ASSIGN TASK WORKFLOW --- */}
      {showAssignForm &&
        createPortal(
          <div className="fixed inset-0 z-100 flex justify-end">
            <div
              className={`absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] transition-opacity duration-500 ${isAssignAnimating ? "opacity-100" : "opacity-0"}`}
              onClick={() => setShowAssignForm(false)}
            />
            <div
              className={`relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-500 ease-out ${isAssignAnimating ? "translate-x-0" : "translate-x-full"}`}
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 text-white rounded-lg flex items-center justify-center"><UserOutlined /></div>
                  <h2 className="text-xl font-bold text-slate-800">Assign Ticket Workflow</h2>
                </div>
                <button onClick={() => setShowAssignForm(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">✕</button>
              </div>

              <div className="flex-1 p-8 overflow-y-auto space-y-6">
                {/* Static Summary Area of Ticket being Targeted */}
                {selectedTicket && (
                  <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-blue-600 bg-blue-100/60 px-2.5 py-0.5 rounded-md">{selectedTicket.ticketId}</span>
                      <Tag color={selectedTicket.priority === "High" ? "volcano" : "orange"} className="m-0 text-[10px] uppercase font-bold px-2 rounded-full">{selectedTicket.priority} Priority</Tag>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 tracking-tight leading-snug">{selectedTicket.subject}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed bg-white/80 p-3 rounded-xl border border-slate-100 italic">
                      "{selectedTicket.description || 'No extended context explanation provided.'}"
                    </p>
                  </div>
                )}

                <Form form={assignForm} layout="vertical" onFinish={onFinishAssignment} id="assignment-form">
                  {/* Select Target Employee */}
                  <Form.Item
                    name="employeeId"
                    label="Assign IT Specialist Staff Member"
                    rules={[{ required: true, message: "Please select an internal engineer" }]}
                  >
                    <Select
                      placeholder="Search and select employee..."
                      size="large"
                      showSearch
                      optionFilterProp="children"
                      className="w-full custom-select-box"
                      getPopupContainer={(trigger) => trigger.parentNode}
                    >
                      {employees.map((emp) => (
                        <Option key={emp._id} value={emp._id}>
                          {emp.Name} ({emp.Department || "Staff"})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* Optional Custom Instructions Box */}
                  <Form.Item
                    name="instructions"
                    label="Task Instructions / Notes (Optional)"
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Add specific resolution constraints, deadlines, or asset details for the engineer..."
                      className="rounded-xl p-3 placeholder:text-slate-300 text-sm"
                    />
                  </Form.Item>
                </Form>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0">
                <Button onClick={() => setShowAssignForm(false)} type="text" className="font-semibold text-slate-500">Cancel</Button>
                <Button 
                  type="primary" 
                  form="assignment-form" 
                  htmlType="submit" 
                  icon={<ArrowRightOutlined />}
                  className="bg-blue-600 h-10 px-8 rounded-xl font-bold border-none flex items-center gap-1.5 shadow-md shadow-blue-100"
                >
                  Deploy Task Assignment
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default TicketQueue;