import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import MainLayout from './components/Common/MainLayout';
import AuthLayout from './components/Common/AuthLayout';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';

// Main Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Income from './pages/Income/Income';
import Expense from './pages/Expense/Expense';
import Budget from './pages/Budget/Budget';
import Reports from './pages/Reports/Reports';
import Transactions from './pages/Transactions/Transactions';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';

// Protected Route Component
import ProtectedRoute from './components/Common/ProtectedRoute';

// Store
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/register"
              element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/forgot-password"
              element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/dashboard" />}
            />
          </Route>

          {/* Protected Routes */}
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

          {/* Redirect */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
