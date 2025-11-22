import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AuthStatus = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed top-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-sm text-blue-700">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Don't show status when not authenticated
  }

  return (
    <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-3 shadow-lg z-50">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <div className="text-sm">
          <span className="text-green-700 font-medium">
            Signed in as {user?.name}
          </span>
          <div className="text-green-600 text-xs">
            {user?.role === 'nurse' ? 'Nurse' : 'Hospital'} Account
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthStatus;