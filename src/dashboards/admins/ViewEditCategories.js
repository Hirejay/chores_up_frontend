import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function ViewEditCategory() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ id: "", name: "", price: "" });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { token } = useSelector((state) => state.auth);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/category/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories(response.data.allCategory);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open edit modal
  const handleEdit = (category) => {
    setFormData({ id: category._id, name: category.categoryName, price: category.price });
    setShowModal(true);
  };

  // Handle category update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/category/edit`,
        {
          categoryId: formData.id,
          categoryName: formData.name,
          price: parseFloat(formData.price),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Category updated successfully");
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  // Handle category deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/category/delete`, {
        data: { categoryId: id },
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Category deleted successfully");
      setCategories(categories.filter((category) => category._id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">View and Edit Categories</h2>
      
      {/* Table Container */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr className="text-left text-gray-700">
              <th className="py-3 px-5 border-b">Name</th>
              <th className="py-3 px-5 border-b">Price</th>
              <th className="py-3 px-5 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category._id} className="hover:bg-gray-50">
                <td className="py-3 px-5">{category.categoryName}</td>
                <td className="py-3 px-5">₹{category.price}</td>
                <td className="py-3 px-5 flex space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Category</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Category"}
              </button>
            </form>

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
