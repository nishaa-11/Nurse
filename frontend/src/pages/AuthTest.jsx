import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AuthTest = () => {
  const { isAuthenticated, user, login, logout, loading, error, success } = useAuth();
  const [testCredentials, setTestCredentials] = useState({
    email: 'test@hospital.com',
    password: 'test123'
  });

  const handleQuickLogin = async (role) => {
    const credentials = {
      email: role === 'nurse' ? 'nurse@test.com' : 'hospital@test.com',
      password: 'test123'
    };
    
    try {
      await login(credentials);
    } catch (err) {
      console.error('Quick login failed:', err);
    }
  };

  const handleTestLogin = async () => {
    try {
      await login(testCredentials);
    } catch (err) {
      console.error('Test login failed:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication Status</h1>
          <p className="text-gray-600">Test and monitor authentication functionality</p>
        </div>

        {/* Current Auth Status */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Status</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">Authentication:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isAuthenticated 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">Loading:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    loading ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {loading ? 'Loading...' : 'Ready'}
                  </span>
                </div>

                {user && (
                  <>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">User:</span>
                      <span className="text-sm text-gray-900">{user.name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Email:</span>
                      <span className="text-sm text-gray-900">{user.email}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Role:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'nurse' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {user.role === 'nurse' ? 'Nurse' : 'Hospital'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              {/* Storage Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">Token:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    localStorage.getItem('token') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {localStorage.getItem('token') ? 'Present' : 'Missing'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">User Data:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    localStorage.getItem('user') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {localStorage.getItem('user') ? 'Stored' : 'Missing'}
                  </span>
                </div>

                {localStorage.getItem('token') && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Token Preview:</p>
                    <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
                      {localStorage.getItem('token')?.substring(0, 50)}...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Authentication Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <p className="text-sm text-green-700 mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
          
          {!isAuthenticated ? (
            <div className="space-y-4">
              {/* Quick Login Options */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Quick Login</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleQuickLogin('nurse')}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors"
                  >
                    {loading ? <LoadingSpinner size="small" text="" /> : 'Login as Nurse'}
                  </button>
                  <button
                    onClick={() => handleQuickLogin('hospital')}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors"
                  >
                    {loading ? <LoadingSpinner size="small" text="" /> : 'Login as Hospital'}
                  </button>
                </div>
              </div>

              {/* Custom Login */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Custom Login</h3>
                <div className="grid md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={testCredentials.email}
                      onChange={(e) => setTestCredentials({...testCredentials, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={testCredentials.password}
                      onChange={(e) => setTestCredentials({...testCredentials, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter password"
                    />
                  </div>
                  <button
                    onClick={handleTestLogin}
                    disabled={loading}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors"
                  >
                    {loading ? <LoadingSpinner size="small" text="" /> : 'Test Login'}
                  </button>
                </div>
              </div>

              {/* Navigation to Official Pages */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Official Authentication</h3>
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Go to Login Page
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Go to Register Page
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-green-800 mb-2">You are logged in!</h3>
                <p className="text-green-700 mb-4">Welcome back, {user?.name}. You can now access your dashboard.</p>
                <div className="flex space-x-4">
                  <Link
                    to={user?.role === 'nurse' ? '/nurse' : '/hospital'}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors"
                  >
                    {loading ? <LoadingSpinner size="small" text="" /> : 'Logout'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Backend Status */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Backend Connection</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Backend URL: <span className="font-mono bg-gray-100 px-2 py-1 rounded">http://localhost:5000</span>
            </p>
            <p className="text-sm text-gray-600">
              Test the backend connection by trying to login. Check the browser console for detailed logs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;