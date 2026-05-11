import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, message, Card, Space, Popconfirm } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, PullRequestOutlined } from '@ant-design/icons';
import axios from 'axios';
import axiosInstance from '../../../utils/axiosInstance';
import Cookies from 'js-cookie'

const AssetRequestPanel = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Fetch all requests (Admin Only)
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const token = Cookies.get("token");
            const res = await axiosInstance.get("/Assets/getAllAssetRequests", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data.data);
        } catch (error) {
            message.error("Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // 2. Handle Action (Approve/Reject)
const handleAction = async (requestId, actionStatus) => {
    const token = Cookies.get("token");
    
    // Log for debugging - Check your browser console (F12)
    console.log("Attempting Action:", actionStatus, "for ID:", requestId);

    try {
        
        const res = await axiosInstance.patch(
            `/Assets/updateAssetRequest/${requestId}`,
            { status: actionStatus }, // This sends 'approved' or 'rejected'
            { 
                headers: { 
                    Authorization: `Bearer ${token}` 
                } 
            }
        );

        if (res.data.success) {
            message.success(res.data.message || `Request ${actionStatus} successfully`);
            // Update UI by removing the processed request
            setRequests(prev => prev.filter(req => req._id !== requestId));
        }
    } catch (error) {
        // Detailed error logging
        console.error("API Error Detail:", error.response?.data || error.message);
        message.error(error.response?.data?.message || "Action failed to reach server");
    }
};

    const columns = [
        {
    title: 'Employee',
    dataIndex: 'requester',
    key: 'requester',
    render: (requester) => (
      <div>
        {/* Use .Name with capital N based on your model */}
        <div className="font-bold text-slate-800">{requester?.Name || "N/A"}</div>
        <div className="text-xs text-slate-500">{requester?.Email}</div>
      </div>
    ),
  },
  {
    title: 'Requested Asset',
    dataIndex: 'asset',
    key: 'asset',
    render: (asset) => (
      <div>
        {/* Use .name based on your Asset model line 11 */}
        <div className="font-semibold text-blue-600">{asset?.name || "Unknown Asset"}</div>
        <Tag color="cyan">{asset?.category}</Tag>
      </div>
    ),
  },
  {
    title: 'Reason',
    dataIndex: 'requestReason',
    key: 'reason',
    render: (text) => <span className="italic text-slate-600">"{text}"</span>
  },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'date',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Approve this request?"
                        description="This will assign the asset to the employee."
                        onConfirm={() => handleAction(record._id, 'approved')}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button 
                            type="primary" 
                            icon={<CheckCircleOutlined />} 
                            className="bg-green-600 hover:bg-green-700 border-none rounded-lg"
                        >
                            Approve
                        </Button>
                    </Popconfirm>

                    <Popconfirm
                        title="Decline this request?"
                        onConfirm={() => handleAction(record._id, 'rejected')}
                        okType="danger"
                    >
                        <Button 
                            danger 
                            icon={<CloseCircleOutlined />} 
                            className="rounded-lg"
                        >
                            Decline
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6 bg-slate-50 min-h-screen animate-in fade-in duration-500 w-full overflow-x-auto">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <PullRequestOutlined className="text-blue-600" />
                        Asset Request Management
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Review and act on employee asset requests
                    </p>
                </div>

                <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden w-full overflow-x-auto">
                    <Table 
                        columns={columns} 
                        dataSource={requests} 
                        rowKey="_id" 
                        loading={loading}
                        pagination={{ pageSize: 8 }}
                        locale={{ emptyText: 'No pending requests' }}
                    />
                </Card>
            </div>
        </div>
    );
};

export default AssetRequestPanel;