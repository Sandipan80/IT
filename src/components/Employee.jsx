import axios from "axios";
import React, { useState, useEffect } from "react";
import MyForm from "./User";
import { createPortal } from 'react-dom';

const Users = () => {
  const [data, setData] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sync animation state with showForm for smooth mounting/unmounting
  useEffect(() => {
    if (showForm) {
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [showForm]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/EmployeeRoute/GetUser");
        setData(res?.data);
      } catch (error) {
        console.error("Error fetching employee list:", error?.response);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = data?.employeeList?.filter((emp) =>
    emp.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.Department?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Asset Directory</h1>
            <p className="text-slate-500 text-sm">{data?.message || 'Manage your organizational resources'}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search name or department..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
            
            <button 
              onClick={() => setShowForm(true)} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-200 transform transition active:scale-95"
            >
              Add Employee
            </button>
          </div>
        </div>

        {/* Employee Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Employee Info</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Internal Code</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Position</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Assets Assigned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((items, index) => (
                  <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">{items?.Name}</span>
                        <span className="text-xs text-slate-500">{items?.Email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {items?.EmployeeCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-800 font-medium">{items?.Department}</div>
                      <div className="text-xs text-slate-400 italic">{items?.Role}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {items?.Assets?.split(',').map((asset, i) => (
                          <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md uppercase font-bold border border-blue-100">
                            {asset.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic">No matches found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Side Drawer Portal */}
        {showForm && createPortal(
          <div className="fixed inset-0 z-[9999] flex justify-end overflow-hidden">
            {/* Backdrop Fade */}
            <div 
              className={`absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-500 ease-in-out ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
              onClick={() => setShowForm(false)}
            />

            {/* Side Panel Slide */}
            <div
              className={`relative w-full max-w-[540px] h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isAnimating ? 'translate-x-0' : 'translate-x-full'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Add New Employee</h2>
                </div>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                <div className="mb-8 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Enter the details below to register a new employee and allocate assets from the inventory.
                  </p>
                </div>
                <MyForm />
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-4">
                <button 
                  onClick={() => setShowForm(false)} 
                  className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  form="employee-form"
                  className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95"
                >
                  Save Employee
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};

export default Users;