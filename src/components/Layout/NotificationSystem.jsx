import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Lightbulb, X, Bell } from 'lucide-react';
import Cookies from 'js-cookie'

const socket = io("https://it-backend-6bvo.onrender.com"); // Your Backend URL

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const userData = Cookies.get("user");
    if (!userData) return;

    const user = JSON.parse(userData);
    // Use the fallback logic to ensure we get the ID regardless of key name
    const userId = user.id || user._id; 
    
    if (user.role === 'admin') {
      socket.emit("join_admin_room");
    } 

    // USE THE userId VARIABLE HERE
    if (userId) {
      socket.emit("join_user_room", userId);
    }

    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => socket.off("notification");
}, []);

  return (
    <>
      {/* --- The Floating Bulb Button --- */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => { setIsOpen(true); setUnreadCount(0); }}
          className="bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:bg-indigo-700 transition-all relative group"
        >
          <Lightbulb size={28} className="group-hover:rotate-12 transition-transform" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* --- The Slide-out Drawer --- */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-60 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Bell size={20} /> Notifications
            </h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-red-500">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {notifications.length === 0 ? (
              <p className="text-gray-400 text-center mt-10">No new alerts</p>
            ) : (
              notifications.map((note, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-500 shadow-sm">
                  <p className="font-semibold text-sm text-gray-800">{note.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{note.message}</p>
                  <span className="text-[10px] text-gray-400 mt-2 block">
                    {new Date(note.time || Date.now()).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationSystem;