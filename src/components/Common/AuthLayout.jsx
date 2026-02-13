import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            FinTracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your finances with ease
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <Outlet />
        </div>

        <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 FinTracker. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
