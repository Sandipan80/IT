import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import UserDirectory from './components/User';
import Users from './components/Employee';
import AssetInventory from './components/AssetInventory';
import TicketQueue from './components/TicketQueue';
import MyAsset from './components/MyAsset';
import LoginPage from './components/Login';
import ProtectedRoute from './components/Routes/ProtectedRoute'; 
import Profile from './components/Pages/Profile';
import Navbar from './components/Layout/Navbar';
import Dashboard from './components/Pages/Dashboard';
import Home from './publicPages/Home';
import About from './PublicPages/About';
import Contact from './PublicPages/Contact';
import ProductA from './PublicPages/Product/ProductA';
import ProductB from './PublicPages/Product/ProductB';
import Test from './PublicPages/Test'
import TestAsset from'./PublicPages/TestAsset'

const AuthListener = () => {
  const navigate = useNavigate();
  const [internalToken, setInternalToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const syncToken = () => {
      const currentToken = localStorage.getItem("token");
      const path = window.location.pathname;

      // Define all your public paths here
      const publicPaths = ['/', '/Login', '/About', '/ContactUs', '/Product/A', '/Product/B', '/Test', '/TestAsset'];

      // Only redirect if there's no token AND the path is NOT in the public list
      if (!currentToken && !publicPaths.includes(path)) {
        setInternalToken(null);
        navigate('/Login', { replace: true });
      } 
      else if (currentToken !== internalToken) {
        setInternalToken(currentToken);
      }
    };

    window.addEventListener('storage', syncToken);
    const interval = setInterval(syncToken, 500);

    return () => {
      window.removeEventListener('storage', syncToken);
      clearInterval(interval);
    };
  }, [navigate, internalToken]);

  return null;
};
function App() {
  return (
    <Router>
      <AuthListener />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<><Navbar /><div className="pt-20"><Outlet /></div></>}>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/About" element={<About />} />
          <Route path="/ContactUs" element={<Contact />} />
          <Route path="/Product/A" element={<ProductA />} />
          <Route path="/Product/B" element={<ProductB />} />
          <Route path="/Test" element={<Test />} />
          <Route path="/TestAsset" element={<TestAsset />} />
        </Route>

        {/* PROTECTED ROUTES SECTION */}
        <Route
          path="/*"
          element={
            <div className="flex h-screen w-full bg-gray-50">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-8">
                <Routes>
                  {/* 1. ACCESSIBLE BY BOTH ADMIN & EMPLOYEE */}
                  <Route element={<ProtectedRoute allowedRoles={['admin', 'employee']} />}>
                    <Route path="/Dashboard" element={<Dashboard />} />
                    <Route path="/TicketQueue" element={<TicketQueue />} />
                    <Route path="/MyAsset" element={<MyAsset />} />
                    <Route path="/Profile/:id" element={<Profile />} />
                  </Route>

                  {/* 2. ACCESSIBLE BY ADMIN ONLY */}
                  <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/Employee" element={<Users />} />
                    <Route path="/AssetInventory" element={<AssetInventory />} />
                    <Route path="/users" element={<UserDirectory />} />
                  </Route>

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/Dashboard" />} />
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;