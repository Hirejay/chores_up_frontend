import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import toast from "react-hot-toast";

const AddCategory = () => {
  const [formData, setFormData] = useState({ categoryName: "", price: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user, token } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate inputs
    if (!formData.categoryName || !formData.price) {
      setError("Please fill in all fields.");
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      // Send data to the backend
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/category/create`, {
        categoryName: formData.categoryName,
        price: parseFloat(formData.price), // Convert price to a number
      },
      {
        headers: {
            Authorization: `Bearer ${token}`, // ✅ Include token for security
        },
      });

      // Clear form and show success message
      setFormData({ categoryName: "", price: "" });
      setSuccess("Category added successfully!");
      toast.success("Category added successfully!");
      console.log("Category added:", response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add category. Please try again.");
      toast.error(err.response?.data?.message || "Failed to add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add Category</h2>

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
          {/* Category Name Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Category Name</label>
            <input
              type="text"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="Enter category name"
              required
            />
          </div>

          {/* Price Input */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="Enter price"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-all duration-300 shadow-md hover:shadow-lg"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>

        {/* Link to other pages (optional) */}
        <div className="mt-4 text-center">
          <Link to="/dashboard/admin" className="text-blue-500 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;