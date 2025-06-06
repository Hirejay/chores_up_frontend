import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { LocationContext } from "../../contexts/LocationContext";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";
import { 
  FiCheckCircle, 
  FiX, 
  FiUser, 
  FiDollarSign, 
  FiPhone, 
  FiMapPin, 
  FiNavigation,
  FiAlertCircle,
  FiClock
} from "react-icons/fi";

function ViewActiveService() {
  const { location, isTracking } = useContext(LocationContext);
  const { token } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [qrCodeData, setQRCodeData] = useState(null);
  const [completingTaskId, setCompletingTaskId] = useState(null);

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/task/active`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setTasks(response.data.tasks);
          toast.success("Active tasks loaded successfully", {
            icon: <FiCheckCircle className="text-green-500" />,
          });
        } else {
          setError("No active tasks found");
        }
      } catch (error) {
        setError("Failed to fetch tasks. Please try again later.");
        toast.error("Failed to fetch tasks", {
          icon: <FiAlertCircle className="text-red-500" />,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [token]);

  const handleMarkAsComplete = async (taskId) => {
    setCompletingTaskId(taskId);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/task/complete`,
        { activeTaskId: taskId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setTasks(tasks.filter(task => task._id !== taskId));
        toast.success("Task completed successfully", {
          icon: <FiCheckCircle className="text-green-500" />,
        });
      } else {
        toast.error("Failed to complete task");
      }
    } catch (error) {
      toast.error("Failed to complete task", {
        icon: <FiAlertCircle className="text-red-500" />,
      });
    } finally {
      setCompletingTaskId(null);
    }
  };

  const handleShowQRCode = async (task) => {
    setSelectedTask(task);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/payment/generateqrcode`,
        {
          amountpay: task.category.price,
          taskId: task._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setQRCodeData(response.data.qrCodeData);
        setShowQRModal(true);
      } else {
        toast.error("Failed to generate QR Code");
      }
    } catch (error) {
      toast.error("Failed to generate QR Code", {
        icon: <FiAlertCircle className="text-red-500" />,
      });
    }
  };

  const QRModal = ({ onClose, qrCodeData }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>
        <h3 className="text-xl font-bold mb-4 text-center">Payment QR Code</h3>
        <div className="flex flex-col items-center">
          {qrCodeData ? (
            <img 
              src={qrCodeData} 
              alt="UPI QR Code" 
              className="w-64 h-64 border border-gray-200 rounded-lg"
            />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center">
              <Spinner size="md" />
            </div>
          )}
          <p className="mt-4 text-gray-600 text-center">
            Scan this QR code using any UPI payment app to complete the payment.
          </p>
          {selectedTask && (
            <p className="mt-2 text-lg font-semibold">
              Amount: ₹{selectedTask.category?.price || "0"}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 max-w-md">
          <div className="flex items-center">
            <FiAlertCircle className="mr-2" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          Your Active Services
        </h1>

        {isTracking ? (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <FiMapPin className="text-blue-500 mr-2" />
                <span className="text-gray-700">
                  <strong>Lat:</strong> {location.lat?.toFixed(6) || "N/A"}
                </span>
              </div>
              <div className="flex items-center">
                <FiMapPin className="text-blue-500 mr-2" />
                <span className="text-gray-700">
                  <strong>Lng:</strong> {location.lng?.toFixed(6) || "N/A"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <div className="flex items-center">
              <FiAlertCircle className="mr-2" />
              <p>Location tracking is not active</p>
            </div>
          </div>
        )}

        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
              >
                <Link
                  to={`view-active-service-map/${task._id}`}
                  state={{ task }}
                  className="block p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {task.category?.categoryName || "Service"}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === "active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <FiDollarSign className="mr-2 text-gray-500" />
                      <span>₹{task.category?.price || "N/A"}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <FiUser className="mr-2 text-gray-500" />
                      <span>
                        {task.client?.firstName || "Client"} {task.client?.lastName || ""}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <FiPhone className="mr-2 text-gray-500" />
                      <span>{task.client?.phoneNo || "N/A"}</span>
                    </div>

                    <div className="flex items-center text-blue-500">
                      <FiNavigation className="mr-2" />
                      <span>View details</span>
                    </div>
                  </div>
                </Link>

                <div className="border-t border-gray-200 p-4 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleShowQRCode(task);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex-1 text-center"
                  >
                    Show QR Code
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleMarkAsComplete(task._id);
                    }}
                    disabled={completingTaskId === task._id}
                    className={`px-4 py-2 rounded-lg transition flex-1 text-center ${
                      completingTaskId === task._id
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {completingTaskId === task._id ? "Completing..." : "Mark Complete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <FiClock className="mx-auto text-4xl text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Active Services
            </h2>
            <p className="text-gray-500">
              You don't have any active services at the moment.
            </p>
          </div>
        )}
      </div>

      {showQRModal && (
        <QRModal 
          onClose={() => setShowQRModal(false)} 
          qrCodeData={qrCodeData} 
        />
      )}
    </div>
  );
}

export default ViewActiveService;