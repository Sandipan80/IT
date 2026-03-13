import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  // 1. This grabs the 'id' from the URL bar (/Profile/65e123...)
  const { id } = useParams(); 
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    // 2. Now we send that ID to your Backend API
    const getDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/LoginRoute/Employee_profile/${id}`);
        setEmployee(response.data); // This is your DB data!
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    if (id) getDetails();
  }, [id]);

  if (!employee) return <div>Loading...</div>;

return (
  <div className="p-6 bg-white rounded-xl shadow-md">
    <h2 className="text-2xl font-bold">{employee.Name}</h2>
    <p className="text-gray-500">Employee ID: {employee.EmployeeCode}</p>
    
    <hr className="my-4" />

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-xs text-gray-400 uppercase">Department</label>
        <p className="font-semibold">{employee.Department}</p>
      </div>
      <div>
        <label className="text-xs text-gray-400 uppercase">Role</label>
        <p className="font-semibold">{employee.Role}</p>
      </div>
      <div className="col-span-2">
        <label className="text-xs text-gray-400 uppercase">Assigned Assets</label>
        <p className="font-semibold">{employee.Assets}</p>
      </div>
    </div>
  </div>
);
};

export default Profile;