
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Card, message, Radio, Select, Space, Tooltip } from "antd";
import { ReloadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
const { Option } = Select;

/**
 * MyForm Component
 * @param {Object} initialData - Pass employee data to enable Edit Mode
 * @param {Function} onSuccess - Callback to refresh table and close drawer
 */
const MyForm = ({ initialData, onSuccess }) => {
  const [form] = Form.useForm();
  const [availableAssets, setAvailableAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- Fetch Available Assets Logic ---
  const fetchAvailableAssets = async () => {
    setLoadingAssets(true);
    try {
      const res = await axiosInstance.get("/Assets/GetAllAssets");
      const allAssets = res.data?.data || [];

      // LOGIC: Show assets that are "Unassigned" 
      // PLUS assets already assigned to THIS specific employee (if editing)
      const filtered = allAssets.filter((asset) => {
        const isUnassigned = asset.status === "Unassigned";
        const isAlreadyMine = initialData && asset.assignedTo?._id === initialData._id;
        return isUnassigned || isAlreadyMine;
      });

      setAvailableAssets(filtered);
    } catch (err) {
      console.error("Failed to fetch assets:", err);
      message.error("Could not load available assets");
    } finally {
      setLoadingAssets(false);
    }
  };

  // --- Populate Form on Edit ---
  useEffect(() => {
    fetchAvailableAssets();
    
    if (initialData) {
      // Pre-fill form with existing user data
      form.setFieldsValue({
        ...initialData,
        // Convert populated asset objects back to ID strings for the Select component
        Assets: initialData.Assets?.map(a => typeof a === 'object' ? a._id : a)
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  // --- Form Submission Logic (Create vs Update) ---
  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      let response;
      
      if (initialData) {
        // UPDATE MODE: Use PUT request
        response = await axiosInstance.put(
          `/EmployeeRoute/UpdateUser/${initialData._id}`,
          values
        );
        message.success("Employee updated successfully!");
      } else {
        // CREATE MODE: Use POST request
        response = await axiosInstance.post(
          "/EmployeeRoute/NewUser",
          values
        );
        message.success("Employee registered successfully!");
      }

      console.log("Success:", response.data);
      
      // If a callback was provided (e.g., from Users.jsx), trigger it
      if (onSuccess) {
        onSuccess();
      }

      // Clear form and refresh asset list if in "Add" mode
      if (!initialData) {
        form.resetFields();
      }
      fetchAvailableAssets();
      
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      message.error(
        "Operation Failed: " +
          (error.response?.data?.message || "Server Error")
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden">
        <Form
          form={form}
          name="register_employee"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className="space-y-2"
        >
          {/* Name and Code Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <Form.Item
              label={<span className="font-semibold text-slate-700">Full Name</span>}
              name="Name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input className="rounded-lg py-2" placeholder="John Doe" />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold text-slate-700">Employee Code</span>}
              name="EmployeeCode"
              rules={[{ required: true, message: "Code is required" }]}
            >
              <Input 
                className="rounded-lg py-2" 
                placeholder="EMP-001" 
                disabled={!!initialData} // Lock code during edits
              />
            </Form.Item>
          </div>

          <Form.Item
            label={<span className="font-semibold text-slate-700">Email Address</span>}
            name="Email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input className="rounded-lg py-2" placeholder="john@company.com" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <Form.Item label={<span className="font-semibold text-slate-700">Department</span>} name="Department">
              <Input className="rounded-lg py-2" placeholder="e.g. Engineering" />
            </Form.Item>

            <Form.Item label={<span className="font-semibold text-slate-700">Job Role</span>} name="Role">
              <Input className="rounded-lg py-2" placeholder="e.g. Developer" />
            </Form.Item>
          </div>

          <Form.Item name="role" label={<span className="font-semibold text-slate-700">System Role</span>} initialValue="employee">
            <Radio.Group className="bg-slate-100 p-1 rounded-lg">
              <Radio.Button value="employee" className="rounded-md border-none">Employee</Radio.Button>
              <Radio.Button value="admin" className="rounded-md border-none">Admin</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label={
              <div className="flex justify-between w-full items-center">
                <span className="font-semibold text-slate-700">
                  Assets to Allocate
                  <Tooltip title="Showing unassigned assets and currently held assets">
                    <InfoCircleOutlined className="ml-2 text-slate-400" />
                  </Tooltip>
                </span>
                <Button 
                  type="link" 
                  size="small" 
                  icon={<ReloadOutlined spin={loadingAssets} />} 
                  onClick={fetchAvailableAssets}
                >
                  Refresh
                </Button>
              </div>
            }
            name="Assets"
          >
            <Select
              mode="multiple"
              allowClear
              loading={loadingAssets}
              placeholder="Search and select assets"
              className="w-full custom-select"
              optionFilterProp="children"
              style={{ borderRadius: '8px' }}
            >
              {availableAssets.map((asset) => (
                <Option key={asset._id} value={asset._id}>
                  <Space>
                    <span className="font-medium text-blue-600">[{asset.assetId}]</span>
                    <span>{asset.name}</span>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="pt-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-lg font-medium rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5"
            >
              {submitting ? "Processing..." : (initialData ? "Update Employee" : "Register & Assign Assets")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default MyForm;