import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // ✅ Read from localStorage directly — NOT from the store
  // Reading from the store causes instant redirect the moment logout() clears
  // the token, which fights with navigate() in Profile.jsx and causes a flash loop.
  // localStorage is only cleared 100ms AFTER navigate('/login') has already run,
  // so by the time this component re-checks, we're already on /login and it doesn't matter.
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;