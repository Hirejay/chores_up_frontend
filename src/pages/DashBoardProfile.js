import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const DashBoardProfile = () => {
  const { token,user } = useSelector((state) => state.auth);
  const changeemail = user?.email;
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    accountType: '',
    image: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [removeImage, setRemoveImage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // Password change state
  const [changePassword, setChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/getuser`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const userData = response.data.data;
        setProfileData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phoneNo: userData.phoneNo || '',
          accountType: userData.accountType || '',
          image: userData.image || generateDefaultAvatar(userData.firstName, userData.lastName)
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
        toast.error(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [token]);

  const generateDefaultAvatar = (firstName, lastName) => {
    return `https://ui-avatars.com/api/?name=${firstName || 'User'}+${lastName || 'Name'}&background=random`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPEG, JPG, and PNG images are allowed');
      return;
    }

    setImageFile(file);
    setRemoveImage(false);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setRemoveImage(true);
    setImageFile(null);
    setImagePreview('');
    setProfileData(prev => ({
      ...prev,
      image: generateDefaultAvatar(prev.firstName, prev.lastName)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('firstName', profileData.firstName);
    formData.append('lastName', profileData.lastName);
    formData.append('phoneNo', profileData.phoneNo);
    formData.append('removeImage', removeImage.toString());
    if (imageFile) formData.append('imageFile', imageFile);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/user/updateuser`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setProfileData({
        ...response.data.user,
        image: response.data.user.image || generateDefaultAvatar(
          response.data.user.firstName, 
          response.data.user.lastName
        )
      });
      setImageFile(null);
      setImagePreview('');
      setRemoveImage(false);
    } catch (err) {
      console.error("Profile update error:", err);
      const errorMsg = err.response?.data?.message || 'Failed to update profile';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/auth/change-password`,
        {
          email:changeemail,
          currPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Password changed successfully!');
      setChangePassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error("Password change error:", err);
      const errorMsg = err.response?.data?.message || 'Failed to change password';
      setPasswordError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-800 text-white py-6 px-8">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-gray-300">Manage your account information</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 flex flex-col items-center">
              <div className="relative mb-4">
                <img
                  src={imagePreview || profileData.image}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
                />
                {isEditing && (
                  <div className="absolute bottom-0 right-0 flex flex-col gap-2">
                    <label className="bg-gray-700 text-white p-2 rounded-full cursor-pointer hover:bg-gray-600">
                      <input
                        type="file"
                        accept="image/jpeg, image/png, image/jpg"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={loading}
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </label>
                    {(profileData.image && !profileData.image.includes('ui-avatars.com') || imagePreview) && (
                      <button
                        onClick={handleRemoveImage}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        disabled={loading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold text-center">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-gray-500 text-center capitalize">{profileData.accountType}</p>

              <div className="mt-6 w-full">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setImageFile(null);
                        setImagePreview('');
                        setRemoveImage(false);
                      }}
                      className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="md:w-2/3">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-100"
                      disabled
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNo"
                      value={profileData.phoneNo}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Account Type</label>
                    <select
                      name="accountType"
                      value={profileData.accountType}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-100"
                      disabled
                    >
                      <option value="worker">Worker</option>
                      <option value="client">Client</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 w-32">First Name</span>
                    <span className="font-medium">{profileData.firstName}</span>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 w-32">Last Name</span>
                    <span className="font-medium">{profileData.lastName}</span>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 w-32">Email</span>
                    <span className="font-medium">{profileData.email}</span>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 w-32">Phone</span>
                    <span className="font-medium">{profileData.phoneNo}</span>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 w-32">Account Type</span>
                    <span className="font-medium capitalize">{profileData.accountType}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Password Change Section */}
          <div className="mt-12 border-t pt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Change Password</h2>
              <button
                onClick={() => setChangePassword(!changePassword)}
                className="text-blue-600 hover:underline"
              >
                {changePassword ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {changePassword && (
              <form onSubmit={handlePasswordSubmit} className="max-w-lg">
                {passwordError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-6 text-sm">
                    {passwordError}
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                    minLength="6"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                    minLength="6"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardProfile;