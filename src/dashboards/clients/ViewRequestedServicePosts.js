import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const ViewRequestedServicePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useSelector((state) => state.auth);

  // Fetch data from the API
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/task/requestedforclient`, {
          headers: {
            Authorization: `Bearer ${token}`, // Assuming you store the token in localStorage
          },
        });
        setPosts(response.data.tasks);
      } catch (err) {
        setError("Failed to fetch service posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Handle cancel request
  const handleCancel = async (taskId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/task/cancel`,{activeTaskId:taskId}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(posts.filter((post) => post._id !== taskId)); // Update the state to remove the canceled task
    } catch (err) {
      setError("Failed to cancel the service post");
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">View Requested Service Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">Task ID: {post._id}</h2>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Category:</span> {post.category.categoryName}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Price:</span> ${post.category.price}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Time:</span> {post.createdAt}
            </p>
            <p className="text-gray-600 mb-4">
              <span className="font-medium">Location:</span> {post.clientLocation.address}
            </p>
            <button
              onClick={() => handleCancel(post._id)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewRequestedServicePosts;