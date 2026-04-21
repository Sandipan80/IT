import React from 'react';
import { Layout, Users, Package, Clock, AlertCircle } from 'lucide-react'; // Optional: npm install lucide-react

const Dashboard = () => {
  const stats = [
    { label: 'Total Assets', value: '1,250', icon: <Package size={20}/>, color: 'bg-blue-500' },
    { label: 'Active Users', value: '482', icon: <Users size={20}/>, color: 'bg-emerald-500' },
    { label: 'Open Tickets', value: '14', icon: <AlertCircle size={20}/>, color: 'bg-orange-500' },
    { label: 'Avg. Uptime', value: '99.9%', icon: <Clock size={20}/>, color: 'bg-purple-500' },
  ];

  const weeklyData = [
    { day: 'Mon', val: 'h-[40%]' },
    { day: 'Tue', val: 'h-[65%]' },
    { day: 'Wed', val: 'h-[50%]' },
    { day: 'Thu', val: 'h-[85%]' },
    { day: 'Fri', val: 'h-[100%]' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">System Overview</h1>

      {/* 1. Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
            <div className={`${stat.color} p-3 rounded-lg text-white shadow-lg`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Static Bar Chart (Tailwind Powered) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Weekly Ticket Activity</h3>
          <div className="flex items-end justify-between h-64 px-4 border-b border-l border-gray-100">
            {weeklyData.map((data, i) => (
              <div key={i} className="flex flex-col items-center w-full group">
                <div className={`w-12 ${data.val} bg-blue-500 rounded-t-md transition-all duration-300 group-hover:bg-blue-600 relative`}>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {data.val.replace('h-[', '').replace('%]', '')}%
                  </span>
                </div>
                <span className="mt-2 text-xs text-gray-500">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Static Distribution List */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Asset Distribution</h3>
          <div className="space-y-4 mt-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Laptops</span>
                <span className="font-semibold">65%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[65%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Monitors</span>
                <span className="font-semibold">20%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[20%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Other</span>
                <span className="font-semibold">15%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full w-[15%]"></div>
              </div>
            </div>
          </div>
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
            <strong>Pro Tip:</strong> Most assets are due for maintenance in the next 30 days.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard