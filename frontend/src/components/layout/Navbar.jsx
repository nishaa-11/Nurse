import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      console.log('Navbar: Logging out user:', user?.name);
      await logout();
      console.log('Navbar: Logout successful, redirecting to home');
      navigate('/');
      setIsMenuOpen(false); // Close mobile menu
    } catch (error) {
      console.error('Navbar: Logout error:', error);
      // Force navigation even if logout fails
      navigate('/');
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="font-bold text-xl text-gray-800">ShiftNow</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={user?.role === 'nurse' ? '/nurse' : '/hospital'}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                {user?.role === 'hospital' && (
                  <Link to="/create-shift" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Create Shift
                  </Link>
                )}
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Profile
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{user?.name?.charAt(0)}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
                  Login
                </Link>
                <Link to="/register" className="block bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={user?.role === 'nurse' ? '/nurse' : '/hospital'}
                  className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  Dashboard
                </Link>
                {user?.role === 'hospital' && (
                  <Link to="/create-shift" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
                    Create Shift
                  </Link>
                )}
                <Link to="/profile" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-500 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;