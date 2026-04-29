import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, message, Card } from 'antd';
import { SendOutlined, LaptopOutlined } from '@ant-design/icons';
import axios from 'axios';

const AvailableAssets = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Fetch unassigned assets from DB
    const fetchAvailableAssets = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:5000/api/Assets/GetUnassignedAssets");
            setAssets(res.data.assets);
        } catch (error) {
            message.error("Failed to load available assets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailableAssets();
    }, []);

    // 2. Handle the Request Action
    const handleRequest = async (assetId) => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.post(
                "http://localhost:5000/api/Assets/createAssetRequest",
                { assetId, reason: "Requested by employee via dashboard" },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            message.success(res.data.message || "Request sent successfully!");
            // Optional: Refresh list or disable button to show it's pending
            fetchAvailableAssets();
        } catch (error) {
            message.error(error.response?.data?.message || "Error sending request");
        }
    };

    const columns = [
        {
            title: 'Asset Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span className="font-semibold text-slate-700">{text}</span>,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (cat) => <Tag color="blue">{cat}</Tag>,
        },
        {
            title: 'Condition',
            dataIndex: 'condition',
            key: 'condition',
            render: (cond) => (
                <Tag color={cond === 'Good' ? 'green' : 'orange'}>{cond}</Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button 
                    type="primary" 
                    icon={<SendOutlined />}
                    onClick={() => handleRequest(record._id)}
                    className="bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center"
                >
                    Request Asset
                </Button>
            ),
        },
    ];

    return (
        <div className="p-6 bg-slate-50 min-h-screen animate-in fade-in duration-500">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <LaptopOutlined className="text-blue-600" />
                        Available Assets
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Browse unassigned equipment and request items for your work
                    </p>
                </div>

                <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden">
                    <Table 
                        dataSource={assets} 
                        columns={columns} 
                        rowKey="_id" 
                        loading={loading}
                        pagination={{ pageSize: 7 }}
                        className="custom-ant-table"
                    />
                </Card>
            </div>
        </div>
    );
};

export default AvailableAssets;