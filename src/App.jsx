import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sidebar from './components/Layout/Sidebar'
import UserDirectory from './components/User'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Users from './components/Employee'
import AssetInventory from './components/AssetInventory'
import TicketQueue from './components/TicketQueue'
import MyAsset from './components/MyAsset'
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router> {/* 2. Wrap everything in a Router */}
      <div className="flex h-screen w-full bg-gray-50">
        {/* The Sidebar stays fixed to the left */}
        <Sidebar />

        {/* The Main Content area */}
        <main className="flex-1 overflow-y-auto p-8">
          <Routes> {/* 3. Define the switchboard for your pages */}
            
            {/* When path is /users, render the UserDirectory component */}
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

          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
