import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Chatbot from './components/Chatbot'
import Orders from './components/Orders'
import Cargo from './components/Cargo'
import Customers from './components/Customers'
import DelayedCargoList from './components/DelayedCargoList'
import Login from './components/Login'
import { ToastContainer } from './components/common/Toast'
import { useAuthStore } from './store/useAuthStore'

// Korumalı Rota Bileşeni
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/cargo" element={<ProtectedRoute><Cargo /></ProtectedRoute>} />
        <Route path="/cargo/delayed" element={<ProtectedRoute><DelayedCargoList /></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App