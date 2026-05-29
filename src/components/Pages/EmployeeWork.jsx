import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Badge, message, Tooltip } from "antd";
import { ClockCircleOutlined, CheckCircleOutlined, ReloadOutlined, CarryOutOutlined } from "@ant-design/icons";
import axiosInstance from "../../../utils/axiosInstance";
import Cookies from "js-cookie";

const EmployeeWork = () => {
  const [workQueue, setWorkQueue] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch logged-in user data safely from cookies
  const userData = JSON.parse(Cookies.get("user") || "{}");
  const employeeId = userData.id;

  // Fetch Assigned Work Queue from Backend
  const fetchWorkQueue = async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/WorkRoute/getEmployeeWork/${employeeId}`);
      setWorkQueue(res.data.workQueue || []);
    } catch (error) {
      console.error("Error fetching work queue:", error);
      message.error("Failed to load your work queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkQueue();
  }, [employeeId]);

  // Handle Mark as Done (Unified Status Update)
  const handleCompleteWork = async (workId) => {
    try {
      await axiosInstance.put(`/WorkRoute/complete/${workId}`);
      message.success("Task completed successfully!");
      fetchWorkQueue(); // Refresh table items locally
    } catch (error) {
      console.error("Error resolving task:", error);
      message.error("Failed to update task status");
    }
  };

  // Ant Design Table Columns Configuration
  const columns = [
    {
      title: "TASK DESCRIPTION",
      key: "taskInfo",
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{record.title}</span>
          <span className="text-xs text-slate-400">
            Type: <Tag className="text-[10px] font-bold py-0 uppercase">{record.workType}</Tag>
          </span>
        </div>
      ),
    },
    {
      title: "SOURCE DETAILS",
      key: "sourceDetails",
      render: (_, record) => {
        if (record.workType === "IT_Ticket" && record.referenceId) {
          return (
            <div className="text-xs text-slate-600 space-y-2">
              <div>
                <strong className="text-slate-700">Category:</strong> {record.referenceId.category}
              </div>
              <div className="italic text-slate-400 bg-slate-50 p-2 rounded-xl border border-slate-100/70">
                "{record.referenceId.description || 'No description provided'}"
              </div>
              
              {/* --- PASTE THIS NEW SECTION FOR INSTRUCTIONS --- */}
              {record.instructions && (
                <div className="mt-2 p-2.5 bg-amber-50/60 border border-amber-100 rounded-xl text-slate-700">
                  <strong className="text-amber-800 block text-[11px] uppercase tracking-wider mb-0.5">
                    Admin Instructions:
                  </strong>
                  <span className="text-slate-600 font-medium">{record.instructions}</span>
                </div>
              )}
              {/* ----------------------------------------------- */}
              
            </div>
          );
        }
        
        // Fallback for General Tasks or custom assignments
        return (
          <div className="text-xs text-slate-600">
            <span className="text-slate-400 italic">General task details</span>
            {record.instructions && (
              <div className="mt-2 p-2.5 bg-amber-50/60 border border-amber-100 rounded-xl text-slate-700">
                <strong className="text-amber-800 block text-[11px] uppercase tracking-wider mb-0.5">
                  Instructions:
                </strong>
                <span className="text-slate-600 font-medium">{record.instructions}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "PRIORITY",
      key: "priority",
      render: (_, record) => {
        const priority = record.referenceId?.priority || "Medium";
        let color = priority === "High" ? "volcano" : priority === "Medium" ? "orange" : "green";
        return (
          <Tag color={color} className="rounded-full px-3 text-xs font-semibold">
            {priority.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          status={status === "Completed" ? "success" : "processing"}
          text={<span className={`text-sm font-medium ${status === "Completed" ? "text-emerald-600" : "text-amber-600"}`}>{status}</span>}
        />
      ),
    },
    {
      title: "ACTION",
      key: "action",
      align: "right",
      render: (_, record) => (
        record.status !== "Completed" ? (
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleCompleteWork(record._id)}
            className="bg-emerald-600 hover:bg-emerald-700 border-none rounded-xl font-bold h-9 flex items-center shadow-md shadow-emerald-100"
          >
            Mark as Done
          </Button>
        ) : (
          <span className="text-emerald-500 font-bold text-xs flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
            <CheckCircleOutlined /> Finished
          </span>
        )
      ),
    },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Section */}
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-200 text-white flex items-center justify-center">
              <CarryOutOutlined className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Assigned Work</h1>
              <p className="text-slate-400 text-sm font-medium">Manage and process your action queue item instances</p>
            </div>
          </div>

          <Tooltip title="Refresh Queue">
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchWorkQueue}
              loading={loading}
              className="rounded-xl h-11 w-11 flex items-center justify-center border-slate-200 text-slate-500 hover:text-emerald-600 shadow-sm bg-white"
            />
          </Tooltip>
        </div>

        {/* Work Breakdown Counts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><ClockCircleOutlined className="text-xl" /></div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Tasks</p>
              <p className="text-2xl font-black text-slate-900">{workQueue.filter(w => w.status !== "Completed").length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircleOutlined className="text-xl" /></div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Resolved Tasks</p>
              <p className="text-2xl font-black text-slate-900">{workQueue.filter(w => w.status === "Completed").length}</p>
            </div>
          </div>
        </div>

        {/* Main Work Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden w-full overflow-x-auto">
          <Table
            columns={columns}
            dataSource={workQueue}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 6 }}
            className="custom-table min-w-full"
            rowClassName={(record) => record.status === "Completed" ? "bg-slate-50/50 opacity-70" : "hover:bg-slate-50/50 transition-colors"}
          />
        </div>

      </div>
    </div>
  );
};

export default EmployeeWork;