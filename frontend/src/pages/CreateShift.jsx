import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { shiftService } from '../services/shiftService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CreateShift = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    department: '',
    paymentRate: '',
    bonusAmount: '',
    requiredSpecializations: '',
    requiredCertifications: '',
    minimumExperience: '',
    hospitalNotes: '',
    urgencyLevel: 'normal'
  });

  // Check authentication on component mount
  React.useEffect(() => {
    console.log('CreateShift - Auth check:', { user: !!user, authenticated: isAuthenticated });
    if (!isAuthenticated) {
      console.log('CreateShift - Not authenticated, redirecting to login');
      navigate('/login');
    }
  }, [user, isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate authentication before submission
    if (!isAuthenticated) {
      setError('You must be logged in to create shifts');
      navigate('/login');
      return;
    }

    // Validate required fields
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime || !formData.department || !formData.paymentRate) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      console.log('CreateShift - Submitting with auth:', {
        user: !!user,
        token: !!localStorage.getItem('token'),
        formData: formData
      });

      // Prepare data for API
      const shiftData = {
        ...formData,
        paymentRate: parseFloat(formData.paymentRate),
        bonusAmount: formData.bonusAmount ? parseFloat(formData.bonusAmount) : 0,
        minimumExperience: formData.minimumExperience ? parseInt(formData.minimumExperience) : 0,
        requiredSpecializations: formData.requiredSpecializations ? 
          formData.requiredSpecializations.split(',').map(s => s.trim()).filter(s => s) : [],
        requiredCertifications: formData.requiredCertifications ? 
          formData.requiredCertifications.split(',').map(s => s.trim()).filter(s => s) : []
      };

      const result = await shiftService.createShift(shiftData);
      console.log('CreateShift - Success:', result);
      
      setSuccess('Shift created successfully!');
      
      // Force a page reload to ensure fresh data
      setTimeout(() => {
        window.location.href = '/hospital';
      }, 1500);

    } catch (error) {
      console.error('CreateShift - Error:', error);
      
      if (error.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(error.response?.data?.message || 'Failed to create shift. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Checking authentication..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Shift</h1>
            <p className="text-gray-600">Post a new nursing shift for qualified nurses to apply</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shift Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., ICU Night Shift"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., ICU, ER, Surgery"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the shift responsibilities and expectations..."
              />
            </div>

            {/* Date and Time */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Payment */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Rate ($/hour) *
                </label>
                <input
                  type="number"
                  name="paymentRate"
                  value={formData.paymentRate}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="25.00"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bonus Amount ($)
                </label>
                <input
                  type="number"
                  name="bonusAmount"
                  value={formData.bonusAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level
                </label>
                <select
                  name="urgencyLevel"
                  value={formData.urgencyLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="normal">Normal</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Requirements</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Experience (years)
                </label>
                <input
                  type="number"
                  name="minimumExperience"
                  value={formData.minimumExperience}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Specializations
                  <span className="text-gray-500 text-xs ml-1">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  name="requiredSpecializations"
                  value={formData.requiredSpecializations}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Critical Care, Emergency Medicine"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Certifications
                  <span className="text-gray-500 text-xs ml-1">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  name="requiredCertifications"
                  value={formData.requiredCertifications}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., ACLS, BLS, PALS"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes for Nurses
              </label>
              <textarea
                name="hospitalNotes"
                value={formData.hospitalNotes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any additional information or special instructions..."
              />
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" text="" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Shift</span>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateShift;