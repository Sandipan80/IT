import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sidebar from './components/Layout/Sidebar'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
<div className="flex h-screen w-full bg-gray-50">
      {/* The Sidebar stays fixed to the left */}
      <Sidebar />

      {/* The Main Content area */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Main Content Area</h1>
        </header>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
           Your page content goes here...
        </div>
      </main>
    </div>
    </>
  )
}

export default App
