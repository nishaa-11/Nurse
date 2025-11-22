import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { shiftService } from '../services/shiftService';
import { URGENCY_LEVELS, SHIFT_STATUS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';

const NurseDashboard = () => {
  const { user } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    available: 0,
    applied: 0,
    assigned: 0,
    earnings: 0
  });

  useEffect(() => {
    loadShifts();
  }, []);

  const loadShifts = async () => {
    try {
      setLoading(true);
      const shiftsData = await shiftService.getAllShifts();
      setShifts(shiftsData);
      calculateStats(shiftsData);
    } catch (error) {
      console.error('Error loading shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (shiftsData) => {
    const available = shiftsData.filter(shift => shift.status === SHIFT_STATUS.OPEN).length;
    const applied = shiftsData.filter(shift => 
      shift.nursesApplied?.some(app => app.nurse === user._id)
    ).length;
    const assigned = shiftsData.filter(shift => 
      shift.nurseAssigned === user._id
    ).length;
    const earnings = shiftsData
      .filter(shift => shift.nurseAssigned === user._id && shift.status === SHIFT_STATUS.COMPLETED)
      .reduce((total, shift) => total + (shift.paymentRate * (shift.duration || 8)), 0);

    setStats({ available, applied, assigned, earnings });
  };

  const handleApplyForShift = async (shiftId) => {
    try {
      await shiftService.applyForShift(shiftId, 'Interested in this shift');
      loadShifts();
    } catch (error) {
      console.error('Error applying for shift:', error);
    }
  };

  const filteredShifts = shifts.filter(shift => {
    switch (filter) {
      case 'available':
        return shift.status === SHIFT_STATUS.OPEN;
      case 'applied':
        return shift.nursesApplied?.some(app => app.nurse === user._id);
      case 'assigned':
        return shift.nurseAssigned === user._id;
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
              const hasApplied = shift.nursesApplied?.some(app => app.nurse === user._id);
              const isAssigned = shift.nurseAssigned === user._id;
              
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
                    
                    <div className="ml-6 flex flex-col space-y-2">
                      {isAssigned ? (
                        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium text-center">
                          ✅ Assigned
                        </span>
                      ) : hasApplied ? (
                        <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium text-center">
                          ⏳ Applied
                        </span>
                      ) : shift.status === SHIFT_STATUS.OPEN ? (
                        <button
                          onClick={() => handleApplyForShift(shift._id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Apply Now
                        </button>
                      ) : (
                        <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium text-center">
                          {shift.status?.replace('-', ' ').toUpperCase()}
                        </span>
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