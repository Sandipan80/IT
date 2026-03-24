import axios from "axios";
import React,{useState,useEffect} from "react";
import axiosInstance from "../../utils/axiosInstance";
import MyForm from "./User";
import { createPortal } from 'react-dom';

const Users=()=>{
    const [data, setData]= useState();
    console.log("Employee List",data);
    useEffect(
        ()=>{
        try{    
            axios.get("http://localhost:5000/api/Assets/getasset").then((res)=>{
                setData(res?.data)
            }).catch((error)=>{
                console.log("error in user list",error?.response);
            })}

            catch(error){
                console.log("error in employee list backend",error?.response);
                
            }
        }
    ,[])

    const [searchTerm, setSearchTerm] = useState('');
// Filter the employeeList based on Name or Department
const filteredEmployees = data?.employeeList.filter((emp) =>
  emp.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  emp.Department?.toLowerCase().includes(searchTerm.toLowerCase())
) || [];
const [showForm, setShowForm] = useState(false);
    return (
  <div className="p-6 bg-slate-50 min-h-screen">
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header & Search Bar Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Asset Directory</h1>
          <p className="text-slate-500 text-sm">{data?.message || 'Manage your organizational resources'}</p>
        </div>
        

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search name or department..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
        <div  className="  text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition hover:-translate-y-1 active:scale-95">
          <button 
        onClick={() => setShowForm(true)} 
        className="bg-blue-500  text-white px-6 py-3 rounded-full transition-transform active:scale-95"
      >
        Add Employee
      </button>

      {/* 3. Conditional Rendering: Only show form if showForm is true */}

{showForm && createPortal(
  <div 
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4 py-8"
    onClick={() => setShowForm(false)}
  >
    {/* The Modal Card */}
    <div 
      className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      onClick={(e) => e.stopPropagation()} // Prevents closing when clicking form
    >
      
      {/* Header with Close Button */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">Add New Employee</h2>
        <button 
          onClick={() => setShowForm(false)}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      {/* Scrollable Form Body */}
      <div className="p-6 overflow-y-auto">
        <MyForm />
      </div>

    </div>
  </div>,
  document.body // This sends the HTML to the end of the body tag
)}

        </div>
      </div>

      {/* Professional Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-1000">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Employee Info</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Internal Code</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Assets Assigned</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((items, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-blue-50/50 transition-colors duration-200 group animate-in fade-in slide-in-from-left-4"
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{items?.Name}</span>
                      <span className="text-xs text-slate-500">{items?.Email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                      {items?.EmployeeCode}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-800 font-medium">{items?.Department}</div>
                    <div className="text-xs text-slate-400 font-medium italic">{items?.Role}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {items?.Assets?.split(',').map((asset, i) => (
                        <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md uppercase font-bold tracking-tighter border border-blue-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                          {asset.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic">
                  No matches found for "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
    
}

export default Users;