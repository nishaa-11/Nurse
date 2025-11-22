import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { shiftService } from '../services/shiftService';
import { ROLES, SHIFT_STATUS, URGENCY_LEVELS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ShiftDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [shift, setShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');

  useEffect(() => {
    loadShift();
  }, [id]);

  const loadShift = async () => {
    try {
      setLoading(true);
      const shiftData = await shiftService.getShift(id);
      setShift(shiftData);
    } catch (error) {
      console.error('Error loading shift:', error);
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setActionLoading(true);
      await shiftService.applyForShift(id, applicationMessage);
      await loadShift();
      setApplicationMessage('');
    } catch (error) {
      console.error('Error applying for shift:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignNurse = async (nurseId) => {
    try {
      setActionLoading(true);
      await shiftService.assignNurse(id, nurseId);
      await loadShift();
    } catch (error) {
      console.error('Error assigning nurse:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case URGENCY_LEVELS.EMERGENCY:
        return 'bg-red-100 text-red-800 border-red-200';
      case URGENCY_LEVELS.HIGH:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case URGENCY_LEVELS.MEDIUM:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diff = end - start;
    return Math.round(diff / (1000 * 60 * 60)); // Convert to hours
  };

  const hasApplied = shift?.nursesApplied?.some(app => app.nurse._id === user._id);
  const isAssigned = shift?.nurseAssigned?._id === user._id;
  const canApply = user?.role === ROLES.NURSE && shift?.status === SHIFT_STATUS.OPEN && !hasApplied && !isAssigned;
  const canManage = user?.role === ROLES.HOSPITAL && shift?.hospital?._id === user._id;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading shift details..." />
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Shift not found</h2>
          <p className="text-gray-600 mb-4">The shift you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center space-x-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
        </div>

        {/* Shift Details Card */}
        <div className={`bg-white rounded-2xl shadow-xl border overflow-hidden mb-8 ${
          shift.surge ? 'border-orange-300' :
          shift.urgencyLevel === URGENCY_LEVELS.EMERGENCY ? 'border-red-300' :
          'border-gray-200'
        }`}>
          {/* Header Banner */}
          <div className={`px-8 py-6 ${
            shift.surge ? 'bg-gradient-to-r from-orange-500 to-red-500' :
            shift.urgencyLevel === URGENCY_LEVELS.EMERGENCY ? 'bg-gradient-to-r from-red-500 to-pink-500' :
            'bg-gradient-to-r from-blue-600 to-purple-600'
          }`}>
            <div className="flex items-start justify-between text-white">
              <div>
                <h1 className="text-3xl font-bold mb-2">{shift.title}</h1>
                <p className="text-lg opacity-90">{shift.hospital?.name}</p>
              </div>
              <div className="text-right">
                {shift.surge && (
                  <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 mb-2">
                    <span className="text-sm font-bold">🔥 SURGE {shift.surgeMultiplier}x</span>
                  </div>
                )}
                <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getUrgencyColor(shift.urgencyLevel)} bg-white`}>
                  {shift.urgencyLevel?.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Description */}
            {shift.description && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{shift.description}</p>
              </div>
            )}

            {/* Shift Details Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">Date</div>
                <div className="font-semibold text-gray-900">{formatDate(shift.date)}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">Time</div>
                <div className="font-semibold text-gray-900">
                  {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                </div>
                <div className="text-xs text-gray-500">
                  ({calculateDuration(shift.startTime, shift.endTime)} hours)
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">Department</div>
                <div className="font-semibold text-gray-900">{shift.department}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">Payment Rate</div>
                <div className="font-bold text-green-600 text-lg">${shift.paymentRate}/hr</div>
                {shift.bonusAmount > 0 && (
                  <div className="text-xs text-green-600">+${shift.bonusAmount} bonus</div>
                )}
              </div>
            </div>

            {/* Requirements */}
            {(shift.requiredSpecializations?.length > 0 || shift.requiredCertifications?.length > 0 || shift.minimumExperience > 0) && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                <div className="space-y-3">
                  {shift.minimumExperience > 0 && (
                    <div>
                      <span className="text-sm text-gray-600">Minimum Experience:</span>
                      <span className="ml-2 font-medium">{shift.minimumExperience} years</span>
                    </div>
                  )}
                  {shift.requiredSpecializations?.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-600 block mb-2">Specializations:</span>
                      <div className="flex flex-wrap gap-2">
                        {shift.requiredSpecializations.map((spec, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {shift.requiredCertifications?.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-600 block mb-2">Certifications:</span>
                      <div className="flex flex-wrap gap-2">
                        {shift.requiredCertifications.map((cert, index) => (
                          <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Hospital Notes */}
            {shift.hospitalNotes && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-700">{shift.hospitalNotes}</p>
                </div>
              </div>
            )}

            {/* Status and Actions */}
            <div className="border-t pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <span className={`px-4 py-2 rounded-lg font-medium ${
                    shift.status === SHIFT_STATUS.OPEN ? 'bg-green-100 text-green-800' :
                    shift.status === SHIFT_STATUS.ASSIGNED ? 'bg-blue-100 text-blue-800' :
                    shift.status === SHIFT_STATUS.COMPLETED ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {shift.status?.replace('-', ' ').toUpperCase()}
                  </span>
                  {isAssigned && (
                    <span className="ml-3 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                      ✅ You are assigned to this shift
                    </span>
                  )}
                  {hasApplied && !isAssigned && (
                    <span className="ml-3 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium">
                      ⏳ Application submitted
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  {canApply && (
                    <div className="flex items-center space-x-4">
                      <input
                        type="text"
                        placeholder="Add a message (optional)..."
                        value={applicationMessage}
                        onChange={(e) => setApplicationMessage(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={handleApply}
                        disabled={actionLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {actionLoading ? <LoadingSpinner size="small" text="" /> : 'Apply Now'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applications (for hospital view) */}
        {canManage && shift.nursesApplied?.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Applications ({shift.nursesApplied.length})
            </h3>
            <div className="space-y-4">
              {shift.nursesApplied.map((application, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-bold text-blue-600">
                            {application.nurse?.name?.charAt(0) || 'N'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{application.nurse?.name || 'Nurse'}</h4>
                          <p className="text-sm text-gray-600">{application.nurse?.email}</p>
                        </div>
                      </div>
                      {application.message && (
                        <p className="text-gray-700 text-sm bg-gray-100 rounded p-3 mb-3">
                          "{application.message}"
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
                        {application.nurse?.nurseProfile?.experienceYears && (
                          <span>{application.nurse.nurseProfile.experienceYears} years exp.</span>
                        )}
                        {application.nurse?.nurseProfile?.rating && (
                          <span>⭐ {application.nurse.nurseProfile.rating}/5</span>
                        )}
                      </div>
                    </div>
                    
                    {shift.status === SHIFT_STATUS.OPEN && (
                      <button
                        onClick={() => handleAssignNurse(application.nurse._id)}
                        disabled={actionLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {actionLoading ? <LoadingSpinner size="small" text="" /> : 'Assign'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assigned Nurse (for hospital view) */}
        {canManage && shift.nurseAssigned && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Assigned Nurse</h3>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="font-bold text-green-600">
                  {shift.nurseAssigned.name?.charAt(0) || 'N'}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{shift.nurseAssigned.name}</h4>
                <p className="text-gray-600">{shift.nurseAssigned.email}</p>
                {shift.assignedAt && (
                  <p className="text-sm text-gray-500">
                    Assigned on: {new Date(shift.assignedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftDetails;