import { BrowserRouter as Router, Routes, Route, Navigate,useNavigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import UserDirectory from './components/User';
import Users from './components/Employee';
import AssetInventory from './components/AssetInventory';
import TicketQueue from './components/TicketQueue';
import MyAsset from './components/MyAsset';
import LoginPage from './components/Login';
import ProtectedRoute from './components/Routes/ProtectedRoute'; 
import Profile from './components/Pages/Profile';
import Upload from './components/Pages/Upload';
import { useEffect } from 'react';
import Upload2 from './components/Pages/Upload';




const AuthListener = () => {
  const navigate = useNavigate();
  // We use state to force a re-render when the token changes
  const [internalToken, setInternalToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const syncToken = () => {
      const currentToken = localStorage.getItem("token");
      
      // If token was deleted manually
      if (!currentToken && window.location.pathname !== '/Login') {
        setInternalToken(null);
        navigate('/Login', { replace: true });
      } 
      // If a token was added (e.g., in another tab)
      else if (currentToken !== internalToken) {
        setInternalToken(currentToken);
      }
    };

    // 1. Listen for storage changes in other tabs
    window.addEventListener('storage', syncToken);
    
    // 2. Poll every 500ms for high-speed detection in the same tab's DevTools
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
                    <Route path="/Profile/:id" element={<Profile />} />
                    <Route path="/Upload2" element={<Upload2 />} />

                    
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