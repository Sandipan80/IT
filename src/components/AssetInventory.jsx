import { useState, useEffect } from "react";
import {
  Table, Button, Form, Input, Select, Tag, Space,
  Popconfirm, Typography, Badge, Row, Col, Drawer,
  message, Tooltip, Empty, Divider, Alert
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, LaptopOutlined,
  CheckCircleOutlined, ClockCircleOutlined, SearchOutlined,
  ReloadOutlined, DatabaseOutlined, UserOutlined, TagOutlined,
  AppstoreOutlined, BarChartOutlined, WifiOutlined, DisconnectOutlined
} from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select;

// ─── API URLs — matches your exact route chain ────────────────────────────────
// server.js       chief.use("/", routes)
// routes/index.js Waiter.use("/api", apiRoutes)
// api/index.js    Waiter.use("/Assets", Assets)
// AssetRegister   Waiter.post("/addasset")  etc.

const BASE = "http://localhost:5000/api/Assets";

const api = {
  getAll: () =>
    fetch(`${BASE}/GetAllAssets`)
      .then(r => r.json()),

  create: (body) =>
    fetch(`${BASE}/addasset`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    }).then(r => r.json()),

  update: (id, body) =>
    fetch(`${BASE}/UpdateAsset/${id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    }).then(r => r.json()),

  remove: (id) =>
    fetch(`${BASE}/DeleteAsset/${id}`, {
      method: "DELETE",
    }).then(r => r.json()),

  health: () =>
    fetch("http://localhost:5000/getStatus", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({}),
    }).then(r => r.json()),
};

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ["Hardware", "Software", "Furniture", "Vehicle", "Other"];
const CATEGORY_COLORS = {
  Hardware: "blue", Software: "purple", Furniture: "orange",
  Vehicle: "cyan", Other: "default",
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AssetInventory() {
  const [assets, setAssets]                 = useState([]);
  const [loading, setLoading]               = useState(true);
  const [drawerOpen, setDrawerOpen]         = useState(false);
  const [editingAsset, setEditingAsset]     = useState(null);
  const [searchText, setSearchText]         = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus]     = useState("All");
  const [saving, setSaving]                 = useState(false);
  const [apiOnline, setApiOnline]           = useState(null);
  const [form]                              = Form.useForm();
  const [messageApi, contextHolder]         = message.useMessage();

  // ─── On mount: check health then load assets ───────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        await api.health();
        setApiOnline(true);
        await fetchAssets();
      } catch {
        setApiOnline(false);
        setLoading(false);
      }
    })();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await api.getAll();
      if (res.success) setAssets(res.data);
      else throw new Error(res.message);
    } catch (err) {
      messageApi.error("Failed to load assets: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Drawer helpers ────────────────────────────────────────────────────────
  const openAddDrawer = () => {
    setEditingAsset(null);
    form.resetFields();
    form.setFieldsValue({ status: "Unassigned", condition: "Good" });
    setDrawerOpen(true);
  };

  const openEditDrawer = (asset) => {
    setEditingAsset(asset);
    form.setFieldsValue({
      name: asset.name, category: asset.category, condition: asset.condition,
      brand: asset.brand, model: asset.model, serialNumber: asset.serialNumber,
      purchaseDate: asset.purchaseDate, value: asset.value,
      status: asset.status, assignedTo: asset.assignedTo, notes: asset.notes,
    });
    setDrawerOpen(true);
  };

  // ─── Submit: POST (create) or PUT (update) ─────────────────────────────────
  const handleSubmit = async () => {
    let values;
    try { values = await form.validateFields(); }
    catch { return; }

    setSaving(true);
    try {
      if (editingAsset) {
        const res = await api.update(editingAsset._id, values);
        if (!res.success) throw new Error(res.message);
        messageApi.success(res.message || "Asset updated!");
      } else {
        const res = await api.create(values);
        if (!res.success) throw new Error(res.message);
        messageApi.success(res.message);
      }
      setDrawerOpen(false);
      await fetchAssets();
    } catch (err) {
      messageApi.error(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (_id) => {
    try {
      const res = await api.remove(_id);
      if (!res.success) throw new Error(res.message);
      messageApi.success(res.message || "Asset deleted");
      await fetchAssets();
    } catch (err) {
      messageApi.error(err.message || "Delete failed");
    }
  };

  // ─── Filtered data ─────────────────────────────────────────────────────────
  const filtered = assets.filter((a) => {
    const q = searchText.toLowerCase();
    const matchSearch = !q ||
      a.name?.toLowerCase().includes(q) ||
      a.assetId?.toLowerCase().includes(q) ||
      a.brand?.toLowerCase().includes(q);
    const matchCat    = filterCategory === "All" || a.category === filterCategory;
    const matchStatus = filterStatus   === "All" || a.status   === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const stats = {
    total:       assets.length,
    assigned:    assets.filter(a => a.status === "Assigned").length,
    unassigned:  assets.filter(a => a.status === "Unassigned").length,
    maintenance: assets.filter(a => a.status === "In Maintenance").length,
  };

  // ─── Table columns ─────────────────────────────────────────────────────────
  const columns = [
    {
      title: "Asset ID", dataIndex: "assetId", key: "assetId", width: 190,
      render: (id) => (
        <Tooltip title="Server-generated unique ID">
          <code className="bg-slate-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-mono font-semibold border border-slate-200">
            {id}
          </code>
        </Tooltip>
      ),
    },
    {
      title: "Asset Name", dataIndex: "name", key: "name",
      render: (name, record) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs flex-shrink-0">
            <LaptopOutlined />
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-sm">{name}</div>
            <div className="text-slate-400 text-xs">{record.brand || "—"}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Category", dataIndex: "category", key: "category",
      render: (cat) => <Tag color={CATEGORY_COLORS[cat]}>{cat}</Tag>,
    },
    {
      title: "Condition", dataIndex: "condition", key: "condition",
      render: (c) => {
        const map = { Excellent: "success", Good: "processing", Fair: "warning", Poor: "error" };
        return <Badge status={map[c] || "default"} text={c} />;
      },
    },
    {
      title: "Purchase Date", dataIndex: "purchaseDate", key: "purchaseDate",
      render: (d) => d ? <Text className="text-slate-600 text-sm">{d}</Text> : <Text type="secondary">—</Text>,
    },
    {
      title: "Value (₹)", dataIndex: "value", key: "value",
      render: (v) => v ? (
        <span className="text-slate-700 font-medium text-sm">
          ₹{Number(v).toLocaleString("en-IN")}
        </span>
      ) : <Text type="secondary">—</Text>,
    },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (status) => {
        const cfg = {
          Assigned:         { color: "success", icon: <CheckCircleOutlined /> },
          Unassigned:       { color: "default", icon: <ClockCircleOutlined /> },
          "In Maintenance": { color: "warning", icon: <ReloadOutlined spin /> },
          Retired:          { color: "error",   icon: <DeleteOutlined /> },
        };
        const c = cfg[status] || cfg.Unassigned;
        return <Tag color={c.color} icon={c.icon} className="font-medium">{status}</Tag>;
      },
    },
    {
      title: "Assigned To", dataIndex: "assignedTo", key: "assignedTo",
      render: (emp, record) =>
        record.status === "Assigned" && emp ? (
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <UserOutlined className="text-indigo-600 text-xs" />
            </div>
            <span className="text-slate-700 text-sm">{emp}</span>
          </div>
        ) : <Text type="secondary" className="text-xs">—</Text>,
    },
    {
      title: "Actions", key: "actions", width: 100,
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} size="small"
              className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50"
              onClick={() => openEditDrawer(record)} />
          </Tooltip>
          <Popconfirm
            title="Delete Asset"
            description={`Permanently delete "${record.name}"?`}
            onConfirm={() => handleDelete(record._id)}
            okText="Delete" okType="danger" cancelText="Cancel"
          >
            <Tooltip title="Delete">
              <Button type="text" icon={<DeleteOutlined />} size="small"
                danger className="hover:bg-red-50" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 font-sans">
      {contextHolder}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg">
              <DatabaseOutlined className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-tight">Asset Inventory</h1>
              <p className="text-xs flex items-center gap-1">
                {apiOnline === null  && <span className="text-slate-400">Connecting…</span>}
                {apiOnline === true  && <><WifiOutlined className="text-emerald-500" /><span className="text-emerald-600 font-medium">Connected</span></>}
                {apiOnline === false && <><DisconnectOutlined className="text-red-400" /><span className="text-red-500 font-medium">Offline</span></>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip title="Refresh from DB">
              <Button icon={<ReloadOutlined />} onClick={fetchAssets} loading={loading} className="rounded-lg" />
            </Tooltip>
            <Button
              type="primary" icon={<PlusOutlined />} size="large"
              onClick={openAddDrawer} disabled={!apiOnline}
              className="rounded-lg font-semibold"
              style={apiOnline ? { background: "linear-gradient(135deg, #4f46e5, #7c3aed)", border: "none" } : {}}
            >
              Add Asset
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* Offline alert */}
        {apiOnline === false && (
          <Alert type="error" showIcon message="Cannot connect to Server"
            description={
              <div className="text-sm">
                <code className="block bg-slate-800 text-green-400 rounded px-3 py-2 text-xs">
                  Try Again when connection is restored
                </code>
              </div>
            }
            className="rounded-xl"
          />
        )}

        {/* Stats */}
        <Row gutter={16}>
          {[
            { label: "Total Assets",   value: stats.total,       icon: <AppstoreOutlined />,    color: "from-indigo-500 to-indigo-600" },
            { label: "Assigned",       value: stats.assigned,    icon: <CheckCircleOutlined />, color: "from-emerald-500 to-emerald-600" },
            { label: "Unassigned",     value: stats.unassigned,  icon: <ClockCircleOutlined />, color: "from-slate-400 to-slate-500" },
            { label: "In Maintenance", value: stats.maintenance, icon: <ReloadOutlined />,      color: "from-amber-500 to-orange-500" },
          ].map((s) => (
            <Col xs={12} sm={6} key={s.label}>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-xl shadow flex-shrink-0`}>
                  {s.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">{s.value}</div>
                  <div className="text-xs text-slate-400 font-medium">{s.label}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-48 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200 focus-within:border-indigo-400 transition-colors">
              <SearchOutlined className="text-slate-400" />
              <input
                className="bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400 flex-1"
                placeholder="Search by name, ID, brand…"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <Select value={filterCategory} onChange={setFilterCategory} className="w-40" suffixIcon={<TagOutlined />}>
              <Option value="All">All Categories</Option>
              {CATEGORIES.map(c => <Option key={c} value={c}>{c}</Option>)}
            </Select>
            <Select value={filterStatus} onChange={setFilterStatus} className="w-44" suffixIcon={<BarChartOutlined />}>
              {["All","Assigned","Unassigned","In Maintenance","Retired"].map(s => (
                <Option key={s} value={s}>{s === "All" ? "All Statuses" : s}</Option>
              ))}
            </Select>
            {(searchText || filterCategory !== "All" || filterStatus !== "All") && (
              <Button type="text" icon={<ReloadOutlined />} size="small"
                onClick={() => { setSearchText(""); setFilterCategory("All"); setFilterStatus("All"); }}
                className="text-slate-400 hover:text-indigo-500">
                Clear
              </Button>
            )}
            <div className="ml-auto text-xs text-slate-400">{filtered.length} of {assets.length} assets</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <Table
            columns={columns} dataSource={filtered} rowKey="_id" loading={loading}
            pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `${t} assets`, className: "px-4 pb-2" }}
            locale={{
              emptyText: (
                <Empty
                  image={<DatabaseOutlined className="text-5xl text-slate-200 mt-4" />}
                  description={
                    <span className="text-slate-400">
                      No assets yet.{" "}
                      {apiOnline && <span className="text-indigo-500 cursor-pointer hover:underline" onClick={openAddDrawer}>Add your first asset</span>}
                    </span>
                  }
                  className="py-12"
                />
              ),
            }}
            rowClassName="hover:bg-indigo-50/30 transition-colors"
            className="[&_.ant-table-thead_th]:bg-slate-50 [&_.ant-table-thead_th]:text-slate-600 [&_.ant-table-thead_th]:font-semibold [&_.ant-table-thead_th]:text-xs [&_.ant-table-thead_th]:uppercase [&_.ant-table-thead_th]:tracking-wide"
          />
        </div>
      </div>

      {/* Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              {editingAsset ? <EditOutlined className="text-white text-sm" /> : <PlusOutlined className="text-white text-sm" />}
            </div>
            <div>
              <div className="font-bold text-slate-800">{editingAsset ? "Edit Asset" : "Add New Asset"}</div>
              {editingAsset && <div className="text-xs text-slate-400 font-mono font-normal">{editingAsset.assetId}</div>}
            </div>
          </div>
        }
        open={drawerOpen} onClose={() => setDrawerOpen(false)} width={480}
        footer={
          <div className="flex gap-3 justify-end">
            <Button onClick={() => setDrawerOpen(false)} size="large" className="rounded-lg">Cancel</Button>
            <Button type="primary" size="large" loading={saving} onClick={handleSubmit}
              className="rounded-lg font-semibold"
              style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", border: "none" }}>
              {saving ? (editingAsset ? "Updating…" : "Saving…") : (editingAsset ? "Update Asset" : "Save Asset")}
            </Button>
          </div>
        }
        styles={{ body: { paddingTop: 8 } }}
      >
        <Form form={form} layout="vertical">
          <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100">
            <p className="text-xs text-slate-500">
              {editingAsset
                ? "Edit the details below. Asset ID cannot be changed."
                : "A unique Asset ID will be auto-generated on save (e.g. HW-M9X2K1-A3F)."}
            </p>
          </div>

          <Form.Item label={<span className="font-semibold text-slate-700">Asset Name</span>} name="name"
            rules={[{ required: true, message: "Please enter asset name" }]}>
            <Input placeholder="e.g. MacBook Pro 14-inch" size="large" className="rounded-lg"
              prefix={<LaptopOutlined className="text-slate-400" />} />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label={<span className="font-semibold text-slate-700">Category</span>} name="category"
                rules={[{ required: true, message: "Select category" }]}>
                <Select placeholder="Select" size="large">
                  {CATEGORIES.map(c => <Option key={c} value={c}>{c}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span className="font-semibold text-slate-700">Condition</span>} name="condition"
                rules={[{ required: true }]}>
                <Select placeholder="Select" size="large">
                  {["Excellent","Good","Fair","Poor"].map(c => <Option key={c} value={c}>{c}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label={<span className="font-semibold text-slate-700">Brand / Make</span>} name="brand">
                <Input placeholder="e.g. Apple" size="large" className="rounded-lg" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span className="font-semibold text-slate-700">Model</span>} name="model">
                <Input placeholder="e.g. MNW83LL/A" size="large" className="rounded-lg" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label={<span className="font-semibold text-slate-700">Serial Number</span>} name="serialNumber">
                <Input placeholder="e.g. SN-XXXXXX" size="large" className="rounded-lg" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span className="font-semibold text-slate-700">Purchase Date</span>} name="purchaseDate">
                <Input type="date" size="large" className="rounded-lg" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label={<span className="font-semibold text-slate-700">Purchase Value (₹)</span>} name="value">
            <Input type="number" placeholder="e.g. 150000" size="large" className="rounded-lg" prefix="₹" />
          </Form.Item>

          <Divider className="my-3" />

          <Form.Item label={<span className="font-semibold text-slate-700">Status</span>} name="status"
            rules={[{ required: true }]}>
            <Select size="large">
              {["Unassigned","Assigned","In Maintenance","Retired"].map(s =>
                <Option key={s} value={s}>{s}</Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(p, c) => p.status !== c.status}>
            {({ getFieldValue }) =>
              getFieldValue("status") === "Assigned" ? (
                <Form.Item
                  label={<span className="font-semibold text-slate-700">Assigned To (Employee)</span>}
                  name="assignedTo"
                  rules={[{ required: true, message: "Enter employee name or ID" }]}
                >
                  <Input placeholder="e.g. Rahul Sharma / EMP-001" size="large" className="rounded-lg"
                    prefix={<UserOutlined className="text-slate-400" />} />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item label={<span className="font-semibold text-slate-700">Notes</span>} name="notes">
            <Input.TextArea placeholder="Any additional notes…" rows={3} className="rounded-lg" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
