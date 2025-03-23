import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const Profile = () => {
  const { token } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState({
    upiid: '',
    gender: '',
    dateOfBirth: '',
    about: '',
    experience: 0,
    categorys: [], // Array of selected category IDs
    profileStatus: 'pending', // Default status
  });

  const [categories, setCategories] = useState([]); // List of all categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // For category search

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/getprofile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Set profile data
        setProfile({
          ...response.data.profile,
          dateOfBirth: response.data.profile.dateOfBirth
            ? new Date(response.data.profile.dateOfBirth).toISOString().split('T')[0]
            : '', // Format date for input field
        });
      } catch (err) {
        setError('Failed to fetch profile data. Please try again later.');
        console.error('Error fetching profile:', err);
        toast.error('Failed to fetch profile data. Please try again later.');
      }
    };

    fetchProfile();
  }, [token]);

  // Fetch categories data from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/category/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Set categories data
        setCategories(response.data.allCategory);
      } catch (err) {
        setError('Failed to fetch categories. Please try again later.');
        console.error('Error fetching categories:', err);
        toast.error('Failed to fetch categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Handle category selection changes
  const handleCategoryChange = (catId) => {
    if (profile.categorys.includes(catId)) {
      // Remove category if already selected
      setProfile({
        ...profile,
        categorys: profile.categorys.filter((cat) => cat !== catId),
      });
    } else {
      // Add category if not selected
      setProfile({ ...profile, categorys: [...profile.categorys, catId] });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send updated profile data to the backend
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/user/createprofile`,
        profile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert('Profile updated successfully!');
        toast.success('Profile updated successfully!')
        setEditMode(false); // Exit edit mode
      } else {
        setError(response.data.message || 'Failed to update profile.');
        toast.error(response.data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter((cat) =>
    cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Profile</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* UPI ID */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">UPI ID</label>
            <input
              type="text"
              name="upiid"
              value={profile.upiid}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              disabled={!editMode}
              required
            />
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              disabled={!editMode}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={profile.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              disabled={!editMode}
              required
            />
          </div>

          {/* About */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">About</label>
            <textarea
              name="about"
              value={profile.about}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              disabled={!editMode}
              required
            />
          </div>

          {/* Experience */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Experience (years)</label>
            <input
              type="number"
              name="experience"
              value={profile.experience}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              disabled={!editMode}
              required
            />
          </div>

          {/* Categories */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Categories</label>
            <div className="relative">
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                disabled={!editMode}
              />
              {/* Dropdown List */}
              <div className="mt-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg">
                {filteredCategories.map((cat) => (
                  <div
                    key={cat._id}
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={profile.categorys.includes(cat._id)}
                      onChange={() => handleCategoryChange(cat._id)}
                      className="mr-2"
                      disabled={!editMode}
                    />
                    <span>{cat.categoryName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Status (Read-only) */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Profile Status</label>
            <input
              type="text"
              name="profileStatus"
              value={profile.profileStatus}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              disabled
            />
          </div>

          {/* Edit/Save Buttons */}
          {editMode ? (
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-all duration-300 shadow-md hover:shadow-lg"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-all duration-300 shadow-md hover:shadow-lg"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;