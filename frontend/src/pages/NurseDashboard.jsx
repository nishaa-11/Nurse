import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { shiftService } from '../services/shiftService';
import { URGENCY_LEVELS, SHIFT_STATUS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';

const NurseDashboard = () => {
  const { user, updateUser, logout } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState({});
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState({
    available: 0,
    applied: 0,
    assigned: 0,
    earnings: 0
  });

  useEffect(() => {
    if (user?._id) {
      loadShifts();
    }
  }, [user?._id]);

  const loadShifts = async () => {
    try {
      setLoading(true);
      console.log('NurseDashboard - Loading shifts for nurse:', user?._id);
      const shiftsData = await shiftService.getAllShifts();
      console.log('NurseDashboard - Received shifts:', shiftsData.length);
      console.log('NurseDashboard - Sample shift applications:', shiftsData[0]?.nursesApplied);
      console.log('NurseDashboard - Current user ID:', user?._id);
      
      // Debug: Check if user has applied to any shifts
      const appliedShifts = shiftsData.filter(shift => 
        shift.nursesApplied?.some(app => {
          console.log('Checking application:', app.nurse, 'vs user:', user?._id);
          return app.nurse === user?._id || app.nurse === user?.id;
        })
      );
      console.log('NurseDashboard - User has applied to', appliedShifts.length, 'shifts');
      
      setShifts(shiftsData);
      calculateStats(shiftsData);
    } catch (error) {
      console.error('Error loading shifts:', error);
      setShifts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (shiftsData) => {
    const available = shiftsData.filter(shift => 
      shift.status === SHIFT_STATUS.OPEN && 
      !shift.nursesApplied?.some(app => app.nurse === user?._id || app.nurse === user?.id)
    ).length;
    const applied = shiftsData.filter(shift => 
      shift.nursesApplied?.some(app => app.nurse === user?._id || app.nurse === user?.id)
    ).length;
    const assigned = shiftsData.filter(shift => 
      shift.nurseAssigned === user?._id || shift.nurseAssigned === user?.id
    ).length;
    const earnings = shiftsData
      .filter(shift => shift.nurseAssigned === user._id && shift.status === SHIFT_STATUS.COMPLETED)
      .reduce((total, shift) => total + (shift.paymentRate * (shift.duration || 8)), 0);

    setStats({ available, applied, assigned, earnings });
  };

  const handleApplyForShift = async (shiftId) => {
    try {
      console.log('Applying for shift:', shiftId);
      console.log('Current user:', user);
      console.log('Token in localStorage:', localStorage.getItem('token') ? 'Present' : 'Missing');
      setLoadingApplications(prev => ({ ...prev, [shiftId]: true }));
      setMessage({ type: '', text: '' }); // Clear previous messages
      
      // Note: Let the API handle authentication, don't redirect prematurely
      
      const result = await shiftService.applyForShift(shiftId, { 
        message: 'Interested in this shift' 
      });
      
      console.log('Application result:', result);
      console.log('Applied nurses in result:', result.nursesApplied);
      
      // Show success message
      setMessage({ 
        type: 'success', 
        text: '✅ Successfully applied for shift! You will be notified if selected.' 
      });
      
      // Auto-hide message after 5 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      
      // Refresh shifts to update UI
      await loadShifts();
      
    } catch (error) {
      console.error('Error applying for shift:', error);
      
      if (error.response?.status === 401) {
        // Authentication failed - try to refresh user data
        console.log('Authentication failed, attempting to refresh user session...');
        
        // Show error message with login prompt
        setMessage({ 
          type: 'error', 
          text: '❌ Session expired. Please log out and log back in.' 
        });
      } else {
        // Other errors
        let errorMessage = '❌ Failed to apply for shift: ';
        errorMessage += (error.response?.data?.message || error.message || 'Please try again');
        
        setMessage({ 
          type: 'error', 
          text: errorMessage
        });
        
        // Auto-hide error message after 7 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 7000);
      }
    } finally {
      setLoadingApplications(prev => ({ ...prev, [shiftId]: false }));
    }
  };

  const filteredShifts = shifts.filter(shift => {
    switch (filter) {
      case 'available':
        return shift.status === SHIFT_STATUS.OPEN && !shift.nursesApplied?.some(app => app.nurse === user?._id || app.nurse === user?.id);
      case 'applied':
        return shift.nursesApplied?.some(app => app.nurse === user?._id || app.nurse === user?.id);
      case 'assigned':
        return shift.nurseAssigned === user?._id || shift.nurseAssigned === user?.id;
      default:
        return true;
    }
  });

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case URGENCY_LEVELS.EMERGENCY:
        return 'text-red-600 bg-red-50';
      case URGENCY_LEVELS.HIGH:
        return 'text-orange-600 bg-orange-50';
      case URGENCY_LEVELS.MEDIUM:
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="mt-2 text-gray-600">Here's what's happening with your shifts today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Shifts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Applied</p>
                <p className="text-2xl font-bold text-gray-900">{stats.applied}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.assigned}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${stats.earnings.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Shifts' },
              { key: 'available', label: 'Available' },
              { key: 'applied', label: 'Applied' },
              { key: 'assigned', label: 'Assigned' }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filter === filterOption.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Success/Error Messages */}
        {message.text && (
          <div className={`p-4 rounded-lg border-l-4 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-400 text-green-700' 
              : 'bg-red-50 border-red-400 text-red-700'
          } animate-pulse`}>
            <div className="flex items-center justify-between">
              <span className="font-medium">{message.text}</span>
              <div className="flex items-center gap-2">
                {message.type === 'error' && message.text.includes('session') && (
                  <button 
                    onClick={() => {
                      logout();
                      window.location.href = '/login';
                    }}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                  >
                    Log Out & Back In
                  </button>
                )}
                <button 
                  onClick={() => setMessage({ type: '', text: '' })}
                  className="ml-2 text-sm underline hover:no-underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shifts List */}
        <div className="space-y-4">
          {filteredShifts.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-lg border border-gray-200 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shifts found</h3>
              <p className="text-gray-600">Check back later for new opportunities!</p>
            </div>
          ) : (
            filteredShifts.map((shift) => {
              const hasApplied = shift.nursesApplied?.some(app => app.nurse === user?._id || app.nurse === user?.id);
              const isAssigned = shift.nurseAssigned === user?._id || shift.nurseAssigned === user?.id;
              
              return (
                <div
                  key={shift._id}
                  className={`bg-white rounded-xl p-6 shadow-lg border transition-all duration-200 hover:shadow-xl ${
                    shift.surge ? 'border-orange-300 bg-gradient-to-r from-orange-50 to-white' :
                    shift.urgencyLevel === URGENCY_LEVELS.EMERGENCY ? 'border-red-300 bg-gradient-to-r from-red-50 to-white' :
                    'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{shift.title}</h3>
                        {shift.surge && (
                          <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full uppercase tracking-wide">
                            🔥 SURGE {shift.surgeMultiplier}x
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(shift.urgencyLevel)}`}>
                          {shift.urgencyLevel?.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{shift.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-500">Date:</span>
                          <p className="text-gray-900">{formatDate(shift.date)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Time:</span>
                          <p className="text-gray-900">{shift.startTime} - {shift.endTime}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Department:</span>
                          <p className="text-gray-900">{shift.department}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Rate:</span>
                          <p className="text-gray-900 font-bold">${shift.paymentRate}/hr</p>
                        </div>
                      </div>
                      
                      {shift.requiredSpecializations?.length > 0 && (
                        <div className="mt-4">
                          <span className="font-medium text-gray-500 text-sm">Required:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {shift.requiredSpecializations.map((spec, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-6 flex flex-col space-y-2 min-w-[120px]">
                      {isAssigned ? (
                        <div className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium shadow-sm text-sm">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Assigned
                        </div>
                      ) : hasApplied ? (
                        <div className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg font-medium shadow-sm text-sm">
                          <svg className="w-4 h-4 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Applied
                        </div>
                      ) : shift.status === SHIFT_STATUS.OPEN ? (
                        <button
                          onClick={() => handleApplyForShift(shift._id)}
                          disabled={loadingApplications[shift._id]}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-sm text-sm"
                        >
                          {loadingApplications[shift._id] ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                              Applying...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                              Apply Now
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-600 rounded-lg font-medium text-sm">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          {shift.status?.replace('-', ' ').toUpperCase()}
                        </div>
                      )}
                      
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Hospital</p>
                        <p className="font-medium text-gray-900">{shift.hospital?.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;