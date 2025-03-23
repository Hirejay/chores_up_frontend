import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link
import { LocationContext } from "../../contexts/LocationContext";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner"; // Assuming you have a Spinner component

function ViewActiveService() {
  const { location, isTracking } = useContext(LocationContext);
  const { token } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [qrCodeData, setQRCodeData] = useState(null); // State to store QR code data

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/task/active`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          setTasks(response.data.tasks); // Set tasks from the API response
          toast.success("Successfully fetched all active tasks!");
        } else {
          setError("Failed to fetch tasks. Please try again later.");
          toast.error("Failed to fetch tasks.");
        }
      } catch (error) {
       
        setError("Failed to fetch tasks. Please try again later.");
        toast.error("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [token]);

  // Handle "Mark as Complete" button click
  const handleMarkAsComplete = async (taskId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/task/complete`,
        { activeTaskId: taskId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        // Update the task status locally
        const updatedTasks = tasks.map((task) =>
          task._id === taskId ? { ...task, status: "completed" } : task
        );
        setTasks(updatedTasks);
        toast.success("Task marked as complete!");
      } else {
        toast.error("Failed to mark task as complete.");
      }
    } catch (error) {
    
      toast.error("Failed to mark task as complete.");
    }
  };

  // Handle "Show QR Code" button click
  const handleShowQRCode = async (task) => {
    setSelectedTask(task);
    try {
      // Fetch QR code data from the backend
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/payment/generateqrcode`,
        {
          amountpay: task.category.price,
          taskId: task._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setQRCodeData(response.data.qrCodeData); // Set QR code data
        setShowQRModal(true); // Show the modal
      } else {
        toast.error("Failed to generate QR Code.");
      }
    } catch (error) {
     
      toast.error("Failed to fetch QR Code.");
    }
  };

  // Modal component defined on the same page
  const Modal = ({ onClose, qrCodeData }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg"
          >
            ❌
          </button>
          <div className="p-6 bg-white rounded-lg">
            <h3 className="text-xl font-bold mb-4">Payment QR Code</h3>
            {qrCodeData ? (
              <img src={qrCodeData} alt="UPI QR Code" className="w-64 h-64" />
            ) : (
              <p className="text-gray-600">Loading QR Code...</p>
            )}
            <p className="mt-4 text-gray-600">
              Scan the QR code to complete the payment.
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner /> {/* Show a loading spinner */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Active Services</h2>

      {isTracking ? (
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <p>
            <strong>Latitude:</strong> {location.lat?.toFixed(6) || "N/A"}
          </p>
          <p>
            <strong>Longitude:</strong> {location.lng?.toFixed(6) || "N/A"}
          </p>
        </div>
      ) : (
        <p className="mb-6 text-red-500">Location tracking is not active.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Link
              to={`view-active-service-map/${task._id}`} // Add the link to navigate to task details
              state={{ task }}
              key={task._id}
              className="p-6 bg-white shadow-lg rounded-xl w-80 h-96 flex flex-col justify-center items-center text-center hover:shadow-xl transition-all no-underline"
            >
              <h3 className="text-xl font-bold mb-2">
                <span className="text-gray-600">Category:</span>{" "}
                {task.category?.categoryName || "N/A"}
              </h3>
              <p className="text-gray-600 text-lg mb-2">
                <span className="text-gray-600">Price:</span> ₹
                {task.category?.price || "N/A"}
              </p>
              <p className="text-gray-600 text-lg mb-2">
                <span className="text-gray-600">Client:</span>{" "}
                {task.client?.firstName || "Unknown"}{" "}
                {task.client?.lastName || ""}
              </p>
              <p className="text-gray-600 text-lg mb-2">
                <span className="text-gray-600">Phone:</span>{" "}
                {task.client?.phoneNo || "N/A"}
              </p>
              <p className="text-gray-600 text-lg mb-2">
                <span className="text-gray-600">Worker:</span>{" "}
                {task.worker?.firstName || "Unassigned"}{" "}
                {task.worker?.lastName || ""}
              </p>
              <p className="text-gray-600 text-lg mb-4">
                <span className="text-gray-600">Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    task.status === "active"
                      ? "text-green-600"
                      : task.status === "completed"
                      ? "text-blue-600"
                      : "text-yellow-600"
                  }`}
                >
                  {task.status}
                </span>
              </p>
              <div className="flex gap-4">
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent link navigation
                    handleShowQRCode(task);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                >
                  Show QR Code
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent link navigation
                    handleMarkAsComplete(task._id);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                >
                  Mark as Complete
                </button>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-600">No active tasks found.</p>
        )}
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <Modal onClose={() => setShowQRModal(false)} qrCodeData={qrCodeData} />
      )}
    </div>
  );
}

export default ViewActiveService;