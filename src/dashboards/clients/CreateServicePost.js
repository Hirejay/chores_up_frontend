import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from "react-redux";

const CreateServicePost = () => {
  const { token } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]); // State to store categories from API
  const [formData, setFormData] = useState({
    category: '',
    instruction: '',
    location: { lat: null, lng: null, address: '' }, // Updated location object
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories from API on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/category/all`,{
          headers: { Authorization: `Bearer ${token}` },
        }); // Fetch categories from the backend
        if (response.data.success) {
          setCategories(response.data.allCategory); // Set the fetched categories
        } else {
          setError('Failed to fetch categories');
          toast.error('Failed to fetch categories');
        }
      } catch (err) {
        setError('Failed to fetch categories');
        toast.error('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle location address changes
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      location: { ...formData.location, [name]: value },
    });
  };

  // Fetch current coordinates using Geolocation API
  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            location: { ...formData.location, lat: latitude, lng: longitude },
          });
        },
        (error) => {
          setError('Unable to fetch your location');
          toast.error('Unable to fetch your location');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      toast.error('Geolocation is not supported by your browser');
    }
  };

  // Open Google Maps with the fetched coordinates
  const openGoogleMaps = () => {
    const { lat, lng } = formData.location;
    if (lat && lng) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    } else {
      setError('No location coordinates available');
      toast.error('No location coordinates available');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.location.lat || !formData.location.lng) {
      setError('Please fetch your location before submitting.');
      toast.error('Please fetch your location before submitting.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        category: formData.category,
        instruction: formData.instruction,
        clientLocation: {latitude:formData.location.lat, longitude:formData.location.lng,address:formData.location.address}, // Ensure this matches the backend's expected structure
      };
      console.log(payload);

      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/task/create`, payload, {
        headers: {
          Authorization: `Bearer ${token}`, // Assuming you use token-based authentication
        },
      });

      if (response.data.success) {
        alert('Task created successfully!');
        toast.success('Task created successfully!');
        // Optionally reset the form after successful submission
        setFormData({
          category: '',
          instruction: '',
          location: { lat: null, lng: null, address: '' },
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Task creation failed');
      toast.error(err.response?.data?.message || 'Task creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Service Post
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Category Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.categoryName} ( {category.price}₹ )
                </option>
              ))}
            </select>
          </div>

          {/* Instruction Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Instruction</label>
            <textarea
              name="instruction"
              value={formData.instruction}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="Enter instructions"
              required
            />
          </div>

          {/* Location Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Location</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={
                  formData.location.lat && formData.location.lng
                    ? `${formData.location.lat}, ${formData.location.lng}`
                    : ''
                }
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                placeholder="Click to fetch location"
              />
              <button
                type="button"
                onClick={fetchCurrentLocation}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Fetch
              </button>
            </div>
            {formData.location.lat && formData.location.lng && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={openGoogleMaps}
                  className="text-blue-500 hover:underline"
                >
                  Open in Google Maps
                </button>
              </div>
            )}
          </div>

          {/* Address Input (Textarea) */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Address</label>
            <textarea
              name="address"
              value={formData.location.address}
              onChange={handleLocationChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="Enter your address"
              rows="3" // Adjust the number of rows as needed
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-all duration-300 shadow-md hover:shadow-lg"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateServicePost;

