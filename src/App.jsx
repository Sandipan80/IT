import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import UserDirectory from './components/User';
import Users from './components/Employee';
import AssetInventory from './components/AssetInventory';
import TicketQueue from './components/TicketQueue';
import MyAsset from './components/MyAsset';
import LoginPage from './components/Login';
import ProtectedRoute from './components/Routes/ProtectedRoute'; // Import the gatekeeper

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTE: Login is accessible to everyone */}
        <Route path="/Login" element={<LoginPage />} />

        {/* PROTECTED ROUTES: Only accessible if token exists */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex h-screen w-full bg-gray-50">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-8">
                  <Routes>
                    <Route path="/users" element={<UserDirectory />} />
                    <Route path="/Employee" element={<Users />} />
                    <Route path="/AssetInventory" element={<AssetInventory />} />
                    <Route path="/TicketQueue" element={<TicketQueue />} />
                    <Route path="/MyAsset" element={<MyAsset />} />
                    
                    {/* Default Landing Page (Dashboard) */}
                    <Route path="/" element={
                      <>
                        <header className="mb-6">
                          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                        </header>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                           Welcome! Select a menu item from the sidebar to begin.
                        </div>
                      </>
                    } />
                    
                    {/* Catch-all: Redirect unknown paths to dashboard */}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;