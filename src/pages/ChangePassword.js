import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ✅ Retrieve email and token from Redux state
  const { user, token } = useSelector((state) => state.auth);
  const email = user?.email;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setSuccess('');

     
      
      try {
          
          const response = await axios.put(
              `${process.env.REACT_APP_API_BASE_URL}/auth/change-password`,
              { email, currPassword:formData.currentPassword,newPassword:formData.newPassword },  // ✅ Send email along with passwords
              {
                  headers: {
                      Authorization: `Bearer ${token}`, // ✅ Include token for security
                  },
              }
          );

         

          setSuccess(response.data.message || 'Password changed successfully!');
          toast.success(response.data.message || 'Password changed successfully!');
          setFormData({
              currentPassword: '',
              newPassword: ''
          });
      } catch (err) {
        
          if (err.response) {
              console.error("❗ Server Response Error:", err.response.data);
              toast.error("❗ Server Response Error:", err.response.data);
          } else if (err.request) {
              console.error("❗ Network Error: No response received");
              toast.error("❗ Network Error: No response received");
          } else {
              console.error("❗ Unexpected Error:", err.message);
              toast.error("❗ Unexpected Error:", err.message);
          }

          setError(err.response?.data?.message || 'Password change failed');
          toast.error(err.response?.data?.message || 'Password change failed');
      } finally {
          
          setLoading(false);
      }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Change Password</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>

          <div className="mt-4 text-center">
            <Link to="/profile" className="text-blue-500 hover:underline">
              Back to Profile
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
