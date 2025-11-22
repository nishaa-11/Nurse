import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { shiftService } from '../services/shiftService';
import { surgeService } from '../services/surgeService';
import { DEPARTMENTS, URGENCY_LEVELS, SHIFT_STATUS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HospitalDashboard = () => {
  const { user } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [surgeMode, setSurgeMode] = useState(false);
  const [newShift, setNewShift] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    department: '',
    paymentRate: '',
    urgencyLevel: URGENCY_LEVELS.MEDIUM,
    requiredSpecializations: [],
    bonusAmount: ''
  });
  const [stats, setStats] = useState({
    totalShifts: 0,
    openShifts: 0,
    assignedShifts: 0,
    completedShifts: 0
  });

  useEffect(() => {
    loadShifts();
  }, []);

  const loadShifts = async () => {
    try {
      setLoading(true);
      const shiftsData = await shiftService.getAllShifts();
      const hospitalShifts = shiftsData.filter(shift => shift.hospital?._id === user._id);
      setShifts(hospitalShifts);
      calculateStats(hospitalShifts);
    } catch (error) {
      console.error('Error loading shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (hospitalShifts) => {
    const totalShifts = hospitalShifts.length;
    const openShifts = hospitalShifts.filter(shift => shift.status === SHIFT_STATUS.OPEN).length;
    const assignedShifts = hospitalShifts.filter(shift => shift.status === SHIFT_STATUS.ASSIGNED).length;
    const completedShifts = hospitalShifts.filter(shift => shift.status === SHIFT_STATUS.COMPLETED).length;

    setStats({ totalShifts, openShifts, assignedShifts, completedShifts });
  };

  const handleCreateShift = async (e) => {
    e.preventDefault();
    try {
      await shiftService.createShift({
        ...newShift,
        paymentRate: parseFloat(newShift.paymentRate),
        bonusAmount: parseFloat(newShift.bonusAmount) || 0
      });
      setShowCreateModal(false);
      setNewShift({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        department: '',
        paymentRate: '',
        urgencyLevel: URGENCY_LEVELS.MEDIUM,
        requiredSpecializations: [],
        bonusAmount: ''
      });
      loadShifts();
    } catch (error) {
      console.error('Error creating shift:', error);
    }
  };

  const handleAssignNurse = async (shiftId, nurseId) => {
    try {
      await shiftService.assignNurse(shiftId, nurseId);
      loadShifts();
    } catch (error) {
      console.error('Error assigning nurse:', error);
    }
  };

  const handleToggleSurge = async () => {
    try {
      if (surgeMode) {
        await surgeService.deactivateSurge();
      } else {
        await surgeService.activateSurge();
      }
      setSurgeMode(!surgeMode);
      loadShifts();
    } catch (error) {
      console.error('Error toggling surge mode:', error);
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user?.name} Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your shifts and staffing needs.</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleToggleSurge}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                surgeMode
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-orange-100 hover:bg-orange-200 text-orange-800'
              }`}
            >
              {surgeMode ? '🔥 Surge Active' : '⚡ Activate Surge'}
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              + Create Shift
            </button>
          </div>
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
                <p className="text-sm font-medium text-gray-600">Total Shifts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalShifts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open Shifts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.openShifts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.assignedShifts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedShifts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shifts List */}
        <div className="space-y-4">
          {shifts.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-lg border border-gray-200 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shifts created yet</h3>
              <p className="text-gray-600 mb-4">Create your first shift to start finding qualified nurses.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Create Your First Shift
              </button>
            </div>
          ) : (
            shifts.map((shift) => (
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
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        shift.status === SHIFT_STATUS.OPEN ? 'bg-green-100 text-green-800' :
                        shift.status === SHIFT_STATUS.ASSIGNED ? 'bg-blue-100 text-blue-800' :
                        shift.status === SHIFT_STATUS.COMPLETED ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {shift.status?.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{shift.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
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
                    
                    {shift.nursesApplied?.length > 0 && (
                      <div className="mb-4">
                        <span className="font-medium text-gray-500 text-sm">Applications ({shift.nursesApplied.length}):</span>
                        <div className="mt-2 space-y-2">
                          {shift.nursesApplied.slice(0, 3).map((application, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">{application.nurse?.name || 'Nurse'}</p>
                                <p className="text-sm text-gray-600">{application.message}</p>
                              </div>
                              {shift.status === SHIFT_STATUS.OPEN && (
                                <button
                                  onClick={() => handleAssignNurse(shift._id, application.nurse)}
                                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                                >
                                  Assign
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-6 text-right">
                    {shift.nurseAssigned && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500">Assigned Nurse</p>
                        <p className="font-bold text-green-600">{shift.nurseAssigned?.name || 'Assigned'}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500">Applications</p>
                      <p className="text-2xl font-bold text-blue-600">{shift.nursesApplied?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Shift Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Shift</h2>
            
            <form onSubmit={handleCreateShift} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shift Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newShift.title}
                    onChange={(e) => setNewShift({ ...newShift, title: e.target.value })}
                    placeholder="e.g., ICU Day Shift"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newShift.department}
                    onChange={(e) => setNewShift({ ...newShift, department: e.target.value })}
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newShift.description}
                  onChange={(e) => setNewShift({ ...newShift, description: e.target.value })}
                  placeholder="Describe the shift requirements and responsibilities..."
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newShift.date}
                    onChange={(e) => setNewShift({ ...newShift, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newShift.startTime}
                    onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newShift.endTime}
                    onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newShift.paymentRate}
                    onChange={(e) => setNewShift({ ...newShift, paymentRate: e.target.value })}
                    placeholder="45.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bonus Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newShift.bonusAmount}
                    onChange={(e) => setNewShift({ ...newShift, bonusAmount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newShift.urgencyLevel}
                    onChange={(e) => setNewShift({ ...newShift, urgencyLevel: e.target.value })}
                  >
                    {Object.values(URGENCY_LEVELS).map((level) => (
                      <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Create Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalDashboard;