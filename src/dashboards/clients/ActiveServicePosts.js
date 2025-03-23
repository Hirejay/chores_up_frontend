import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ActiveServicePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchActivePosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/task/active`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPosts(response.data.tasks);
        toast.success("Fetched Task Succcessfully");
      } catch (err) {
        setError("Failed to fetch active service posts");
        toast.error("Failed to fetch active service posts");
      } finally {
        setLoading(false);
      }
    };

    fetchActivePosts();
  }, [token]);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Active Service Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link
              to={`active-service-map/${post._id}`}
              key={post._id}
              className="block"
            >
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer">
                <h2 className="text-xl font-semibold mb-2">
                  {post.category?.categoryName || "N/A"}
                </h2>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Price:</span> ₹
                  {post.category?.price || "N/A"}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Instruction:</span> 
                  {post.instruction || "N/A"}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Worker:</span>{" "}
                  {post.worker?.firstName || "N/A"} {post.worker?.lastName || ""}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Phone:</span>{" "}
                  {post.worker?.phoneNo || "N/A"}
                </p>
                <p className="text-gray-600 ">
                  <span className="font-medium">Client:</span>{" "}
                  {post.client?.firstName || "N/A"} {post.client?.lastName || ""}
                </p>
                
              </div>
            </Link>
          ))
        ) : (
          <div>No Active Tasks Found</div>
        )}
      </div>
    </div>
  );
};

export default ActiveServicePosts;