import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiUser, 
  FiDollarSign,
  FiTag,
  FiAlertCircle
} from "react-icons/fi";

export default function HistoryServices() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [canceledTasks, setCanceledTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/task/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCompletedTasks(response.data.completedTasks);
        setCanceledTasks(response.data.canceledTasks);
        toast.success("History fetched successfully", {
          icon: <FiCheckCircle className="text-green-500" />,
        });
      } catch (error) {
        setError("Failed to fetch history. Please try again later.");
        toast.error("Failed to fetch history. Please try again later.", {
          icon: <FiAlertCircle className="text-red-500" />,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-4 md:mx-8">
        <div className="flex items-center">
          <FiAlertCircle className="mr-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">
        Service History
      </h2>

      {/* Completed Tasks */}
      <div className="mb-10">
        <div className="flex items-center mb-4">
          <FiCheckCircle className="text-green-500 mr-2 text-xl" />
          <h3 className="text-lg md:text-xl font-semibold text-gray-700">
            Completed Services ({completedTasks.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {completedTasks.length > 0 ? (
                completedTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-medium text-sm text-gray-900">
                        {task.category?.categoryName || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ID: {task._id.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      ₹{task.category?.price || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiUser className="mr-2" />
                        {task.client?.firstName || "N/A"} {task.client?.lastName || ""}
                      </div>
                      {task.client?.phoneNo && (
                        <div className="text-xs text-gray-500 mt-1">
                          {task.client.phoneNo}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {formatDate(task.completedAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-sm text-gray-500">
                    No completed services found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Canceled Tasks */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <FiXCircle className="text-red-500 mr-2 text-xl" />
          <h3 className="text-lg md:text-xl font-semibold text-gray-700">
            Canceled Services ({canceledTasks.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Canceled
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {canceledTasks.length > 0 ? (
                canceledTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-medium text-sm text-gray-900">
                        {task.category?.categoryName || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ID: {task._id.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      ₹{task.category?.price || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiUser className="mr-2" />
                        {task.client?.firstName || "N/A"} {task.client?.lastName || ""}
                      </div>
                      {task.client?.phoneNo && (
                        <div className="text-xs text-gray-500 mt-1">
                          {task.client.phoneNo}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {formatDate(task.completedAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-sm text-gray-500">
                    No canceled services found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}