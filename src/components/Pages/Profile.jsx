import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { Button, Popconfirm, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";

const Profile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/EmployeeRoute/Employee_profile/${id}`,
        );
        setEmployee(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
        message.error("Failed to load profile");
      }
    };

    if (id) getDetails();
  }, [id]);

  // Define the logout handler directly
  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    Cookies.remove("user", { path: "/" });
    message.success("Logged out successfully");
    window.location.href = "/Login";
  };

  if (!employee)
    return (
      <div className="p-10 text-center text-gray-500">Loading Profile...</div>
    );

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-2xl mx-auto mt-10">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{employee.Name}</h2>
          <p className="text-gray-500">Employee ID: {employee.EmployeeCode}</p>
        </div>

        {/* Logout Popconfirm */}
        <Popconfirm
          title="Logout"
          description="Are you sure you want to log out?"
          onConfirm={handleLogout}
          okText="Yes"
          cancelText="No"
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<LogoutOutlined />}
            className="flex items-center justify-center font-medium transition-colors duration-300 
                       bg-red-50 text-red-600 hover:bg-red-600! hover:text-white! border border-red-200"
            style={{ height: "40px", borderRadius: "8px" }}
          >
            Logout
          </Button>
        </Popconfirm>
      </div>

      <hr className="my-4" />

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wider">
            Department
          </label>
          <p className="font-semibold text-lg">
            {employee.Department || "N/A"}
          </p>
        </div>
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wider">
            Role
          </label>
          <p className="font-semibold text-lg">{employee.Role || "N/A"}</p>
        </div>
        {/* // Inside your Profile.jsx return statement */}
        <div className="col-span-2 mt-4">
          <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">
            Assigned Assets
          </label>
          <div className="flex flex-wrap gap-2">
            {employee.Assets && employee.Assets.length > 0 ? (
              // Check if it's a string (from your current backend) or an array
              (typeof employee.Assets === "string"
                ? employee.Assets.split(", ")
                : employee.Assets
              ).map((asset, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 
                     rounded-full text-sm font-medium shadow-sm"
                >
                  {asset}
                </span>
              ))
            ) : (
              <span className="text-gray-400 italic">No assets assigned</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
