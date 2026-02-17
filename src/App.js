import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './components/Common/MainLayout';
import AuthLayout from './components/Common/AuthLayout';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Income from './pages/Income/Income';
import Expense from './pages/Expense/Expense';
import Budget from './pages/Budget/Budget';
import Reports from './pages/Reports/Reports';
import Transactions from './pages/Transactions/Transactions';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';

// Protected Route
import ProtectedRoute from './components/Common/ProtectedRoute';

// Store
import { useAuthStore } from './store/authStore';


function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Default */}
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;


