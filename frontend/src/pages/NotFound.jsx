import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';

const NotFound = () => {
  const { user, isAuthenticated } = useAuth();

  const getHomePath = () => {
    if (!isAuthenticated || !user) return '/';
    return user.role === ROLES.NURSE ? '/nurse' : '/hospital';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6 py-8 bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-6xl font-bold text-blue-600 mb-2">404</div>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>
          
          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h1>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to={getHomePath()}
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Go Home'}
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
            
            {!isAuthenticated && (
              <Link
                to="/login"
                className="block w-full text-blue-600 hover:text-blue-700 py-2 px-4 font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
          
          {/* Quick Links */}
          {isAuthenticated && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Quick links:</p>
              <div className="flex justify-center space-x-4 text-sm">
                <Link
                  to="/profile"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Profile
                </Link>
                {user?.role === ROLES.NURSE ? (
                  <Link
                    to="/nurse"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Find Shifts
                  </Link>
                ) : (
                  <Link
                    to="/hospital"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Manage Shifts
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;