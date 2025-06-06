import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";
import { 
  FiAlertCircle, 
  FiCheckCircle, 
  FiClock, 
  FiMapPin, 
  FiDollarSign, 
  FiUser, 
  FiPhone, 
  FiInfo,
  FiNavigation,
  FiCalendar
} from "react-icons/fi";

const ActiveServicePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useSelector((state) => state.auth);

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
        toast.success("Active tasks fetched successfully", {
          icon: <FiCheckCircle className="text-green-500" />,
        });
      } catch (err) {
        setError("Failed to fetch active service posts");
        toast.error("Failed to fetch active service posts", {
          icon: <FiAlertCircle className="text-red-500" />,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActivePosts();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md w-full">
          <div className="flex items-center">
            <FiAlertCircle className="mr-2" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Active Service Requests
          </h1>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {posts.length} Active
          </span>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {posts.map((post) => (
              <Link
                to={`active-service-map/${post._id}`}
                key={post._id}
                className="block"
              >
                <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 truncate">
                      {post.category?.categoryName || "N/A"}
                    </h2>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <FiDollarSign className="mr-2 text-gray-500" />
                      <span>₹{post.category?.price || "N/A"}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <FiCalendar className="mr-2 text-gray-500" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>

                    {post.instruction && (
                      <div className="flex items-start text-gray-600">
                        <FiInfo className="mr-2 mt-1 text-gray-500" />
                        <span className="flex-1">
                          {post.instruction.length > 50
                            ? `${post.instruction.substring(0, 50)}...`
                            : post.instruction}
                        </span>
                      </div>
                    )}

                    {post.worker && (
                      <>
                        <div className="flex items-center text-gray-600">
                          <FiUser className="mr-2 text-gray-500" />
                          <span>
                            {post.worker?.firstName || "N/A"} {post.worker?.lastName || ""}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <FiPhone className="mr-2 text-gray-500" />
                          <span>{post.worker?.phoneNo || "N/A"}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Click to view details
                    </span>
                    <div className="flex items-center text-blue-500 group-hover:text-blue-600">
                      <FiNavigation className="mr-1" />
                      <span className="text-sm font-medium">View Map</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="max-w-md mx-auto">
              <FiClock className="mx-auto text-4xl text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No Active Services Found
              </h2>
              <p className="text-gray-500 mb-4">
                You don't have any active service requests at the moment.
              </p>
              <Link
                to="/create-task" // Update this to your create task route
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Create New Request
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveServicePosts;