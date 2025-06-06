import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";
import { FiAlertCircle, FiCheckCircle, FiClock, FiMapPin, FiDollarSign, FiTag } from "react-icons/fi";
import { format, parseISO } from "date-fns";

const ViewRequestedServicePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const { token } = useSelector((state) => state.auth);

  // Fetch data from the API
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/task/requestedforclient`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(response.data.tasks);
        toast.success("Fetched requested services successfully", {
          icon: <FiCheckCircle className="text-green-500" />,
        });
      } catch (err) {
        setError("Failed to fetch service posts");
        toast.error("Failed to fetch service posts", {
          icon: <FiAlertCircle className="text-red-500" />,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [token]);

  // Handle cancel request
  const handleCancel = async (taskId) => {
    setCancellingId(taskId);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/task/cancel`,
        { activeTaskId: taskId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(posts.filter((post) => post._id !== taskId));
      toast.success("Service request canceled", {
        icon: <FiCheckCircle className="text-green-500" />,
      });
    } catch (err) {
      setError("Failed to cancel the service post");
      toast.error("Failed to cancel the service post", {
        icon: <FiAlertCircle className="text-red-500" />,
      });
    } finally {
      setCancellingId(null);
    }
  };

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

  if (posts.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <FiTag className="mx-auto text-4xl text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No Requested Services Found
          </h2>
          <p className="text-gray-500">
            You haven't requested any services yet. When you do, they'll appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          Your Requested Services
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {post.category.categoryName}
                </h2>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Pending
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <FiDollarSign className="mr-2 text-gray-500" />
                  <span>₹{post.category.price}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <FiClock className="mr-2 text-gray-500" />
                  <span>
                    {format(parseISO(post.createdAt), "MMM dd, yyyy hh:mm a")}
                  </span>
                </div>

                <div className="flex items-start text-gray-600">
                  <FiMapPin className="mr-2 mt-1 text-gray-500" />
                  <span className="flex-1">
                    {post.clientLocation.address.length > 50
                      ? `${post.clientLocation.address.substring(0, 50)}...`
                      : post.clientLocation.address}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => handleCancel(post._id)}
                  disabled={cancellingId === post._id}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition duration-300 ${
                    cancellingId === post._id
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  {cancellingId === post._id ? "Cancelling..." : "Cancel Request"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewRequestedServicePosts;