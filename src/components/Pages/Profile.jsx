import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { Button, Popconfirm, message, Tag } from "antd";
import { LogoutOutlined, ClockCircleOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";

const Profile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  // Initialize as empty array to prevent .length errors
  const [requests, setRequests] = useState([]); 
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    const getDetails = async () => {
      try {
        // 1. Fetch Profile Details
        const profileRes = await axiosInstance.get(`/EmployeeRoute/Employee_profile/${id}`);
        setEmployee(profileRes.data);

        // 2. Fetch Asset Requests
        const requestRes = await axiosInstance.get(`/Assets/GetEmpAssetReq/${id}`);
        
        // Safety check: ensure we are setting an array
        if (requestRes.data && Array.isArray(requestRes.data.data)) {
          setRequests(requestRes.data.data);
        } else {
          setRequests([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        message.error("Failed to load profile data");
        setRequests([]); // Fallback to empty array on error
      } finally {
        setLoadingRequests(false);
      }
    };

    if (id) getDetails();
  }, [id]);

  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    Cookies.remove("user", { path: "/" });
    message.success("Logged out successfully");
    window.location.href = "/Login";
  };

  if (!employee) return <div className="p-10 text-center text-gray-500">Loading Profile...</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-2xl mx-auto mt-10">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{employee.Name}</h2>
          <p className="text-gray-500">Employee ID: {employee.EmployeeCode}</p>
        </div>
        <Popconfirm title="Logout" description="Are you sure?" onConfirm={handleLogout} okText="Yes" cancelText="No">
          <Button type="text" icon={<LogoutOutlined />} className="bg-red-50 text-red-600 border border-red-200" style={{ height: "40px", borderRadius: "8px" }}>
            Logout
          </Button>
        </Popconfirm>
      </div>

      <hr className="my-4" />

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-xs text-gray-400 uppercase">Department</label>
          <p className="font-semibold text-lg">{employee.Department || "N/A"}</p>
        </div>
        <div>
          <label className="text-xs text-gray-400 uppercase">Role</label>
          <p className="font-semibold text-lg">{employee.Role || "N/A"}</p>
        </div>

        <div className="col-span-2 mt-4">
          <label className="text-xs text-gray-400 uppercase block mb-2">Currently Assigned Assets</label>
          <div className="flex flex-wrap gap-2">
            {employee.Assets && employee.Assets.length > 0 ? (
              (typeof employee.Assets === "string" ? employee.Assets.split(", ") : employee.Assets).map((asset, index) => (
                <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-sm font-medium">
                  {asset}
                </span>
              ))
            ) : (
              <span className="text-gray-400 italic text-sm">No assets currently assigned</span>
            )}
          </div>
        </div>

        {/* Requested Assets Section */}
<div className="col-span-2 mt-6">
  <label className="text-xs text-blue-500 font-bold uppercase tracking-widest block mb-3">
    Current Active Requests
  </label>
  
  <div className="space-y-3">
    {requests && requests.length > 0 ? (
      requests.map((req) => (
        <div key={req._id} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg bg-gray-50 shadow-sm">
          <div>
            {/* asset.name comes from the .populate('asset') in backend */}
            <p className="font-bold text-gray-800">{req.asset?.name || "Asset Details Loading..."}</p>
            <p className="text-[11px] text-gray-400 mt-1">
              Requested on: {new Date(req.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Tag color="processing" className="px-3 py-1 rounded-full border-none font-semibold">
            {req.status.toUpperCase()}
          </Tag>
        </div>
      ))
    ) : (
      <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
        <p className="text-gray-400 text-sm italic">No active requests found in the system.</p>
      </div>
    )}
  </div>
</div>
      </div>
    </div>
  );
};

export default Profile;