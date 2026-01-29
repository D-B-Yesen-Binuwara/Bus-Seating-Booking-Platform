import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, Eye, EyeOff, Check, X } from 'lucide-react';

export default function MyProfile() {
  const { user, updateProfile } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    password: '',
    confirmPassword: '',
    phone: user?.phone || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrorMessage('');
  };

  const validateForm = () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }
    if (formData.password && formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    const result = await updateProfile(
      formData.name || undefined,
      formData.password || undefined,
      formData.phone || undefined
    );

    setLoading(false);

    if (result.error) {
      setErrorMessage(result.error.message);
    } else {
      setSuccessMessage('Profile updated successfully!');
      setFormData({
        name: result.user?.name || '',
        password: '',
        confirmPassword: '',
        phone: result.user?.phone || ''
      });
      setTimeout(() => {
        setIsEditMode(false);
        setSuccessMessage('');
      }, 2000);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setFormData({
      name: user?.name || '',
      password: '',
      confirmPassword: '',
      phone: user?.phone || ''
    });
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and settings</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          
          {/* Profile Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 sm:px-8 py-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                  <p className="text-blue-100">User Account</p>
                </div>
              </div>
              {!isEditMode && (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-md"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="px-6 sm:px-8 py-8">
            
            {/* Success/Error Messages */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600" />
                <p className="text-green-800">{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <X className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{errorMessage}</p>
              </div>
            )}

            {!isEditMode ? (
              // Display Mode
              <div className="space-y-4">
                {/* User ID hidden by request */}

                {/* Username */}
                <div className="flex items-start p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 text-blue-600">
                      <User className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4 flex-grow">
                    <p className="text-sm font-medium text-gray-600">Username</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{user?.name}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 text-blue-600">
                      <Mail className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4 flex-grow">
                    <p className="text-sm font-medium text-gray-600">Email Address</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{user?.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 text-blue-600">
                      <Phone className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4 flex-grow">
                    <p className="text-sm font-medium text-gray-600">Phone Number</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {user?.phone ? user.phone : <span className="text-gray-400">Not provided</span>}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Note:</span> Leave password fields empty if you don't want to change it
                  </p>
                </div>

                {/* Username Field (editable when in edit mode) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <X className="h-5 w-5" />
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

