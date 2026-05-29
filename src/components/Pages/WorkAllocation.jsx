import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Tag,
  Badge,
  message,
  Tooltip,
  Empty,
} from "antd";
import {
  RocketOutlined,
  UserOutlined,
  FileTextOutlined,
  SendOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  IdcardOutlined,
  TagOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../../utils/axiosInstance";

const { Option } = Select;

const AssignWork = () => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([]);
  const [liveQueue, setLiveQueue] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState("General_Task");

  // Fetch directory data for employee matching loops
  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get("/EmployeeRoute/GetUser");
      setEmployees(res?.data?.employeeList || []);
    } catch (error) {
      message.error("Failed to fetch employee listing for assignment");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Form submission execution script
  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const targetEmployee = employees.find(
        (emp) => emp._id === values.employeeId,
      );
      const employeeName = targetEmployee
        ? targetEmployee.Name
        : "Staff Member";

      // Build out dynamic values to ensure it fits work.model.js rules exactly
      const payload = {
        employeeId: values.employeeId,
        workType: values.workType,
        workModel: values.workModel,
        //  THE FIXED LINE:
        referenceId:
          values.referenceId ||
          window.crypto.randomUUID().replace(/-/g, "").substring(0, 24),
        title: values.title,
        instructions:
          values.instructions || "No specific instructions provided.",
      };

      // API invocation matching your established routes context
      await axiosInstance.post("/WorkRoute/createGeneralWork", payload);

      message.success(`Task successfully deployed to ${employeeName}!`);

      // Update our local UI queue stream view with a temporary item to show instant confirmation
      setLiveQueue((prev) => [
        {
          _id: Date.now().toString(),
          ...payload,
          employeeName,
          status: "Pending",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      form.resetFields(["title", "instructions", "referenceId"]);
    } catch (error) {
      console.error(error);
      message.error("Failed to register task inside collection pipeline");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen w-full animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
        {/* ================= LEFT CONTROLS PANE: THE CORE FORM ================= */}
        <div className="w-full lg:w-[45%] bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6 sticky top-8">
          <div>
            <div className="inline-flex p-3 bg-blue-600 rounded-2xl text-white shadow-md shadow-blue-100 mb-3">
              <RocketOutlined className="text-xl" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Deploy Work Assignment
            </h1>
            <p className="text-slate-400 text-xs font-medium">
              Instantiate an active work payload tracking entry mapping schema
              criteria fields.
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ workType: "General_Task", workModel: "Task" }}
            requiredMark={false}
            className="space-y-4"
          >
            {/* Custom Matrix Grid Choice Card Elements */}
            <Form.Item
              name="workType"
              label={
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Assignment Domain Context
                </span>
              }
            >
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => {
                    form.setFieldsValue({
                      workType: "General_Task",
                      workModel: "Task",
                    });
                    setSelectedType("General_Task");
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedType === "General_Task" ? "border-blue-600 bg-blue-50/40 text-blue-600" : "border-slate-100 bg-slate-50 hover:border-slate-200 text-slate-500"}`}
                >
                  <TagOutlined className="text-lg block mb-1" />
                  <span className="font-bold text-sm block">General Task</span>
                  <span className="text-[11px] opacity-70 block mt-0.5">
                    Project sprints & actions
                  </span>
                </div>
                <div
                  onClick={() => {
                    form.setFieldsValue({
                      workType: "IT_Ticket",
                      workModel: "TicketSchema",
                    });
                    setSelectedType("IT_Ticket");
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedType === "IT_Ticket" ? "border-blue-600 bg-blue-50/40 text-blue-600" : "border-slate-100 bg-slate-50 hover:border-slate-200 text-slate-500"}`}
                >
                  <FileTextOutlined className="text-lg block mb-1" />
                  <span className="font-bold text-sm block">
                    Infrastructure / IT
                  </span>
                  <span className="text-[11px] opacity-70 block mt-0.5">
                    Hardware support tasks
                  </span>
                </div>
              </div>
            </Form.Item>

            {/* Target Collection Tracking Parameter (Hidden configuration but automatically driven based on selection) */}
            <Form.Item name="workModel" noStyle>
              <Input type="hidden" />
            </Form.Item>

            {/* Title Selection Row */}
            <Form.Item
              name="title"
              label={
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Assignment Title Summary
                </span>
              }
              rules={[
                { required: true, message: "A concise title is required" },
              ]}
            >
              <Input
                placeholder="e.g., Audit server array logs / Deploy wide-leg trousers project asset assets"
                className="rounded-xl py-2.5 bg-slate-50 border-slate-100 focus:bg-white text-sm"
              />
            </Form.Item>

            {/* Target Reference Document Link Identifier */}
            <Form.Item
              name="referenceId"
              label={
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  Source Reference Identifier (Optional)
                  <Tooltip title="Maps directly to referenceId inside model.js. Will auto-generate a valid unique context payload if left blank.">
                    <InfoCircleOutlined className="text-slate-300" />
                  </Tooltip>
                </span>
              }
            >
              <Input
                prefix={<IdcardOutlined className="text-slate-300" />}
                placeholder="MongoDB Hex ObjectId configuration code string..."
                className="rounded-xl py-2.5 bg-slate-50 border-slate-100 font-mono text-xs"
              />
            </Form.Item>

            {/* Assignee Selection Block */}
            <Form.Item
              name="employeeId"
              label={
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Target Team Member
                </span>
              }
              rules={[
                { required: true, message: "Please choose an active engineer" },
              ]}
            >
              <Select
                placeholder="Select staff directory record..."
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

            {/* Instructions Payload Area */}
            <Form.Item
              name="instructions"
              label={
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Execution Guidelines
                </span>
              }
            >
              <Input.TextArea
                rows={4}
                placeholder="Provide tactical constraints, deadlines, or context guidelines notes..."
                className="rounded-xl p-3 bg-slate-50 border-slate-100 focus:bg-white text-sm"
              />
            </Form.Item>

            {/* Trigger Button */}
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              icon={<SendOutlined />}
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl font-bold border-none flex items-center justify-center gap-2 shadow-lg shadow-blue-100 mt-2"
            >
              Deploy Stream Assignment
            </Button>
          </Form>
        </div>

        {/* ================= RIGHT DISPLAY PANE: LIVE STREAM FEED ================= */}
        <div className="w-full lg:w-[55%] space-y-4">
          <div className="flex justify-between items-center px-2">
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Active Deployment Stream
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Monitoring active generated task payloads created within this
                session runtime loop.
              </p>
            </div>
            <Badge
              count={liveQueue.length}
              className="bg-blue-50 text-blue-600 font-bold border-none px-3 py-1 rounded-xl text-xs"
            />
          </div>

          <div className="space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto pr-2 w-full">
            {liveQueue.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-12 text-center flex flex-col items-center justify-center">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span className="text-slate-400 font-medium text-xs">
                      No assignments deployed this session yet. Use the catalyst
                      pane to invoke records.
                    </span>
                  }
                />
              </div>
            ) : (
              liveQueue.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all animate-in slide-in-from-top-4 duration-500 relative overflow-hidden group"
                >
                  {/* Accent bar color based on classification selection type */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.workType === "IT_Ticket" ? "bg-amber-500" : "bg-blue-600"}`}
                  />

                  <div className="flex justify-between items-start pl-2">
                    <div className="space-y-2 max-w-[80%]">
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag className="text-[10px] font-black uppercase border-none px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 tracking-wider">
                          {item.workType}
                        </Tag>
                        <Tag
                          color="blue"
                          className="text-[10px] font-bold border-none px-2 py-0.5 rounded-md tracking-wider"
                        >
                          REF: {item.workModel}
                        </Tag>
                      </div>

                      <h3 className="text-sm font-black text-slate-800 tracking-tight leading-snug">
                        {item.title}
                      </h3>

                      <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100/50">
                        <UserOutlined className="text-slate-400" />
                        <span>
                          Assigned to:{" "}
                          <strong className="text-slate-700">
                            {item.employeeName}
                          </strong>
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 leading-relaxed bg-slate-50/40 p-3 rounded-xl border border-dashed border-slate-200 mt-2">
                        <strong className="text-slate-500 block text-[10px] uppercase tracking-wider mb-0.5">
                          Instructions Matrix:
                        </strong>
                        "{item.instructions}"
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 text-right">
                      <span className="text-[10px] font-mono font-bold text-slate-300">
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="text-amber-600 font-black text-[10px] uppercase tracking-wider bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl inline-flex items-center gap-1">
                        <ClockCircleOutlined /> {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignWork;
