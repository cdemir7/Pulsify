import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Chatbot from './components/Chatbot'
import Orders from './components/Orders'
import Cargo from './components/Cargo'
import Customers from './components/Customers'
import DelayedCargoList from './components/DelayedCargoList'
import { ToastContainer } from './components/common/Toast'

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/cargo" element={<Cargo />} />
        <Route path="/cargo/delayed" element={<DelayedCargoList />} />
        <Route path="/customers" element={<Customers />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App