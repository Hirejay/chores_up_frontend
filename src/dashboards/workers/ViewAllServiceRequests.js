/*
import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-arrowheads";
import { LocationContext } from "../../contexts/LocationContext";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";
// Icons for map markers
const motorcycleIcon = new L.Icon({
  iconUrl: "https://res.cloudinary.com/doqlcojpk/image/upload/v1742756388/CHORESUP/mapicon.webp",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const antennaIcon = new L.Icon({
  iconUrl: "https://res.cloudinary.com/doqlcojpk/image/upload/v1742750573/CHORESUP/homelogo.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});



function ViewAllServiceRequests() {
  const { token } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  // Fetch tasks from the API
  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/task/requestedforworker`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.tasks?.length) {
        setTasks(response.data.tasks);
      } else {
        console.error("Sorry, There Is No Service Requests For Now:", response.data);
        toast.error("Sorry, There Is No Service Requests For Now");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Error fetching tasks");
    }finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) {
    return <Spinner/>;
  }

  return (
    <div className="flex flex-wrap gap-8 p-8 bg-gray-100 min-h-screen">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task._id}
            onClick={() => {
              setSelectedTask(task);
              setShowPopup(true);
            }}
            className="p-8 bg-white shadow-lg rounded-xl w-96 h-64 cursor-pointer hover:shadow-xl transition-all flex flex-col "
          >
            <h3 className="text-xl font-bold"><strong>Category:</strong> {task.category.categoryName}</h3>
            
            <p className="text-gray-600 text-lg">
              <strong>Price:</strong> ₹{task.category.price}
            </p>

            <p className="text-gray-600 text-lg">
              <strong>Instruction:</strong> {task.instruction}
            </p>

            <p className="text-gray-600 text-lg">
              <strong>Client:</strong> {task.client.firstName} {task.client.lastName}
            </p>



            <p
              className={`text-lg font-semibold ${
                task.status === "Pending" ? "text-yellow-600" : "text-green-600"
              }`}
            >
              <strong>Status:</strong> {task.status}
            </p>
          </div>

        ))
      ) : (
        <p className="text-gray-600 text-lg">No tasks available.</p>
      )}

      {showPopup && selectedTask && (
        <PopupModal
          task={selectedTask}
          onClose={() => {
            setShowPopup(false);
            setSelectedTask(null); // Reset selected task
          }}
          onTaskAccepted={(taskId) => {
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task._id === taskId ? { ...task, status: "Accepted" } : task
              )
            );
          }}
        />
      )}
    </div>
  );
}

function PopupModal({ task, onClose, onTaskAccepted }) {
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const { location, isTracking } = useContext(LocationContext);
  const { token } = useSelector((state) => state.auth);

  

  const fetchRoute = useCallback(async () => {
    if (!task || !location.lat || !location.lng) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/location/get-route-requested`,
        {
          workerLatitude: location.lat.toFixed(6),
          workerLongitude: location.lng.toFixed(6),
          taskId: task._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setRoute(response.data.geometry);
        setDistance(response.data.distance);
        setDuration(response.data.duration);
      } else {
        console.error("Invalid route response:", response.data);
        toast.error("Invalid route response");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      toast.error("Error fetching route");
    }
  }, [task, token]);

  useEffect(() => {
    if(isTracking){
      fetchRoute();
    }else{
      toast.error("LocationTracking is Stopped, Please Start Location Tracking");
      onClose();

    }
    
  }, [fetchRoute]);

  // Component to auto-center the map on the route
  function AutoCenterMap({ route }) {
    const map = useMap();

    useEffect(() => {
      if (route?.coordinates) {
        const bounds = L.latLngBounds(
          route.coordinates.map(([lng, lat]) => [lat, lng])
        );
        map.fitBounds(bounds);
      }
    }, [route, map]);

    return null;
  }

  const handleAcceptTask = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/task/accept`,
        { requestedTaskId: task._id ,workerLocation:{ latitude:location.lat ,longitude:location.lng }},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onTaskAccepted(task._id);
      onClose();
    } catch (error) {
      console.error("Error accepting task:", error);
      toast.error("Error accepting task");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-6xl h-[80vh] overflow-y-auto relative flex flex-col lg:flex-row gap-6">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-2xl"
        >
          ❌
        </button>

       
        <div className="flex-1 h-full">
          <MapContainer
            center={[task.clientLocation.latitude, task.clientLocation.longitude]}
            zoom={14}
            className="h-full w-full rounded-lg shadow-md"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {route && (
              <>
                <Polyline
                  positions={route.coordinates.map(([lng, lat]) => [lat, lng])}
                  color="red"
                />
                <AutoCenterMap route={route} />
              </>
            )}
            <Marker
              position={[task.clientLocation.latitude, task.clientLocation.longitude]}
              
              icon={antennaIcon}
            />
            <Marker
              position={[location.lat, location.lng]}
              icon={motorcycleIcon}
              
            />
          </MapContainer>
        </div>

      
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-6">Task Details</h3>
            <p className="text-lg">
              <strong>Category:</strong> {task.category.categoryName}
            </p>
            <p className="text-lg">
              <strong>Price:</strong> ₹{task.category.price}
            </p>
            <p className="text-lg">
              <strong>Instruction:</strong> {task.instruction}
            </p>
            <p className="text-lg">
              <strong>Client:</strong> {task.client.firstName} {task.client.lastName}
            </p>
            
            <p className="text-lg">
              <strong>Distance:</strong> {distance}
            </p>
            <p className="text-lg">
              <strong>Duration:</strong> {duration}
            </p>
          </div>

     
          <button
            onClick={handleAcceptTask}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Accept Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewAllServiceRequests;
*/




/*
import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LocationContext } from "../../contexts/LocationContext";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";
import { 
  FiCheckCircle, 
  FiX, 
  FiClock, 
  FiUser, 
  FiDollarSign,
  FiMapPin,
  FiInfo,
  FiAlertTriangle,
  FiNavigation
} from "react-icons/fi";

// Custom icons for map markers
const workerIcon = new L.Icon({
  iconUrl: "https://res.cloudinary.com/doqlcojpk/image/upload/v1742756388/CHORESUP/mapicon.webp",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -15]
});

const clientIcon = new L.Icon({
  iconUrl: "https://res.cloudinary.com/doqlcojpk/image/upload/v1742750573/CHORESUP/homelogo.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -15]
});

function ViewAllServiceRequests() {
  const { token } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/task/requestedforworker`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.tasks?.length) {
        setTasks(response.data.tasks);
      } else {
        setError("No service requests available at this time");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load service requests");
      toast.error("Failed to load service requests", {
        icon: <FiAlertTriangle className="text-red-500" />
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskAccepted = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    toast.success("Task accepted successfully", {
      icon: <FiCheckCircle className="text-green-500" />
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 max-w-md">
          <div className="flex items-center">
            <FiAlertTriangle className="mr-2" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Available Service Requests
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            onClick={() => setSelectedTask(task)}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-gray-800">
                {task.category?.categoryName || "Service"}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                task.status === "Pending" 
                  ? "bg-yellow-100 text-yellow-800" 
                  : "bg-green-100 text-green-800"
              }`}>
                {task.status}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center text-gray-600">
                <FiDollarSign className="mr-2 text-gray-500" />
                <span>₹{task.category?.price || "N/A"}</span>
              </div>

              <div className="flex items-start text-gray-600">
                <FiUser className="mr-2 mt-0.5 text-gray-500" />
                <span>
                  {task.client?.firstName || "Client"} {task.client?.lastName || ""}
                </span>
              </div>

              {task.instruction && (
                <div className="flex items-start text-gray-600">
                  <FiInfo className="mr-2 mt-0.5 text-gray-500" />
                  <span className="line-clamp-2">
                    {task.instruction}
                  </span>
                </div>
              )}

              <div className="flex items-center text-blue-500">
                <FiNavigation className="mr-2" />
                <span>View details</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskAccepted={handleTaskAccepted}
        />
      )}
    </div>
  );
}

function TaskDetailsModal({ task, onClose, onTaskAccepted }) {
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(true);
  const [routeError, setRouteError] = useState(null);
  const { location, isTracking } = useContext(LocationContext);
  const { token } = useSelector((state) => state.auth);

  const fetchRoute = useCallback(async () => {
    if (!task || !location.lat || !location.lng) return;

    setLoadingRoute(true);
    setRouteError(null);
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/location/get-route-requested`,
        {
          workerLatitude: location.lat.toFixed(6),
          workerLongitude: location.lng.toFixed(6),
          taskId: task._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setRoute(response.data.geometry);
        setDistance(response.data.distance);
        setDuration(response.data.duration);
      } else {
        setRouteError("Could not calculate route");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      setRouteError("Error calculating route");
    } finally {
      setLoadingRoute(false);
    }
  }, [task, token, location]);

  useEffect(() => {
    if (isTracking && task) {
      fetchRoute();
    } else if (!isTracking) {
      toast.error("Please enable location tracking to view route", {
        icon: <FiAlertTriangle className="text-red-500" />
      });
      onClose();
    }
  }, [fetchRoute, isTracking, task, onClose]);

  function AutoCenterMap({ route }) {
    const map = useMap();

    useEffect(() => {
      if (route?.coordinates) {
        const bounds = L.latLngBounds(
          route.coordinates.map(([lng, lat]) => [lat, lng])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [route, map]);

    return null;
  }

  const handleAcceptTask = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/task/accept`,
        { 
          requestedTaskId: task._id,
          workerLocation: { 
            latitude: location.lat, 
            longitude: location.lng 
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onTaskAccepted(task._id);
      onClose();
    } catch (error) {
      console.error("Error accepting task:", error);
      toast.error("Failed to accept task", {
        icon: <FiAlertTriangle className="text-red-500" />
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col lg:flex-row">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50 bg-white rounded-full p-2 shadow-md"
        >
          <FiX size={20} />
        </button>

      
        <div className="flex-1 h-64 lg:h-auto">
          {loadingRoute ? (
            <div className="h-full flex items-center justify-center bg-gray-100">
              <Spinner size="md" />
            </div>
          ) : routeError ? (
            <div className="h-full flex items-center justify-center bg-gray-100 p-4 text-center">
              <div className="text-red-500">
                <FiAlertTriangle size={24} className="mx-auto mb-2" />
                <p>{routeError}</p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={[task.clientLocation.latitude, task.clientLocation.longitude]}
              zoom={14}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {route && (
                <>
                  <Polyline
                    positions={route.coordinates.map(([lng, lat]) => [lat, lng])}
                    color="#3b82f6"
                    weight={4}
                  />
                  <AutoCenterMap route={route} />
                </>
              )}
              <Marker
                position={[task.clientLocation.latitude, task.clientLocation.longitude]}
                icon={clientIcon}
              />
              <Marker
                position={[location.lat, location.lng]}
                icon={workerIcon}
              />
            </MapContainer>
          )}
        </div>

       
        <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Service Details</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700">Service Type</h3>
              <p className="text-gray-600">{task.category?.categoryName || "N/A"}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">Price</h3>
              <p className="text-gray-600">₹{task.category?.price || "N/A"}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">Client</h3>
              <p className="text-gray-600">
                {task.client?.firstName || "N/A"} {task.client?.lastName || ""}
              </p>
              {task.client?.phoneNo && (
                <p className="text-gray-600 text-sm mt-1">
                  Phone: {task.client.phoneNo}
                </p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">Location</h3>
              <p className="text-gray-600 flex items-start">
                <FiMapPin className="mr-2 mt-1 flex-shrink-0" />
                <span>{task.clientLocation?.address || "N/A"}</span>
              </p>
            </div>

            {task.instruction && (
              <div>
                <h3 className="font-semibold text-gray-700">Instructions</h3>
                <p className="text-gray-600">{task.instruction}</p>
              </div>
            )}

            {distance && duration && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-blue-800 text-sm">Distance</h3>
                  <p className="text-blue-600">{distance}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-blue-800 text-sm">Duration</h3>
                  <p className="text-blue-600">{duration}</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleAcceptTask}
            disabled={loadingRoute || routeError}
            className={`mt-6 w-full py-3 rounded-lg font-medium transition ${
              loadingRoute || routeError
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loadingRoute ? "Loading..." : routeError ? "Cannot Accept (Route Error)" : "Accept Service"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewAllServiceRequests;
*/




import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LocationContext } from "../../contexts/LocationContext";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";
import { 
  FiCheckCircle, 
  FiX, 
  FiClock, 
  FiUser, 
  FiDollarSign,
  FiMapPin,
  FiInfo,
  FiAlertTriangle,
  FiNavigation
} from "react-icons/fi";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons for map markers
const workerIcon = new L.Icon({
  iconUrl: "https://res.cloudinary.com/doqlcojpk/image/upload/v1742756388/CHORESUP/mapicon.webp",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -15]
});

const clientIcon = new L.Icon({
  iconUrl: "https://res.cloudinary.com/doqlcojpk/image/upload/v1742750573/CHORESUP/homelogo.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -15]
});

// Custom CSS for the map
const mapStyles = `
  .leaflet-container {
    height: 100%;
    width: 100%;
    min-height: 300px;
    z-index: 0;
  }
  
  @media (max-width: 768px) {
    .leaflet-container {
      min-height: 250px;
    }
  }
`;

function ViewAllServiceRequests() {
  const { token } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/task/requestedforworker`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.tasks?.length) {
        setTasks(response.data.tasks);
      } else {
        setError("No service requests available at this time");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load service requests");
      toast.error("Failed to load service requests", {
        icon: <FiAlertTriangle className="text-red-500" />
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskAccepted = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    toast.success("Task accepted successfully", {
      icon: <FiCheckCircle className="text-green-500" />
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 max-w-md">
          <div className="flex items-center">
            <FiAlertTriangle className="mr-2" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <style>{mapStyles}</style>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Available Service Requests
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            onClick={() => setSelectedTask(task)}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-gray-800">
                {task.category?.categoryName || "Service"}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                task.status === "Pending" 
                  ? "bg-yellow-100 text-yellow-800" 
                  : "bg-green-100 text-green-800"
              }`}>
                {task.status}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center text-gray-600">
                <FiDollarSign className="mr-2 text-gray-500" />
                <span>₹{task.category?.price || "N/A"}</span>
              </div>

              <div className="flex items-start text-gray-600">
                <FiUser className="mr-2 mt-0.5 text-gray-500" />
                <span>
                  {task.client?.firstName || "Client"} {task.client?.lastName || ""}
                </span>
              </div>

              {task.instruction && (
                <div className="flex items-start text-gray-600">
                  <FiInfo className="mr-2 mt-0.5 text-gray-500" />
                  <span className="line-clamp-2">
                    {task.instruction}
                  </span>
                </div>
              )}

              <div className="flex items-center text-blue-500">
                <FiNavigation className="mr-2" />
                <span>View details</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskAccepted={handleTaskAccepted}
        />
      )}
    </div>
  );
}

function TaskDetailsModal({ task, onClose, onTaskAccepted }) {
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(true);
  const [routeError, setRouteError] = useState(null);
  const { location, isTracking } = useContext(LocationContext);
  const { token } = useSelector((state) => state.auth);

  const fetchRoute = useCallback(async () => {
    if (!task || !location.lat || !location.lng) return;

    setLoadingRoute(true);
    setRouteError(null);
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/location/get-route-requested`,
        {
          workerLatitude: location.lat.toFixed(6),
          workerLongitude: location.lng.toFixed(6),
          taskId: task._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setRoute(response.data.geometry);
        setDistance(response.data.distance);
        setDuration(response.data.duration);
      } else {
        setRouteError("Could not calculate route");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      setRouteError("Error calculating route");
    } finally {
      setLoadingRoute(false);
    }
  }, [task, token, location]);

  useEffect(() => {
    if (isTracking && task) {
      fetchRoute();
    } else if (!isTracking) {
      toast.error("Please enable location tracking to view route", {
        icon: <FiAlertTriangle className="text-red-500" />
      });
      onClose();
    }
  }, [fetchRoute, isTracking, task, onClose]);

  function AutoCenterMap({ route }) {
    const map = useMap();

    useEffect(() => {
      if (route?.coordinates) {
        const bounds = L.latLngBounds(
          route.coordinates.map(([lng, lat]) => [lat, lng])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [route, map]);

    return null;
  }

  const handleAcceptTask = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/task/accept`,
        { 
          requestedTaskId: task._id,
          workerLocation: { 
            latitude: location.lat, 
            longitude: location.lng 
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onTaskAccepted(task._id);
      onClose();
    } catch (error) {
      console.error("Error accepting task:", error);
      toast.error("Failed to accept task", {
        icon: <FiAlertTriangle className="text-red-500" />
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col lg:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50 bg-white rounded-full p-2 shadow-md"
        >
          <FiX size={20} />
        </button>

        {/* Map Section - Updated with proper mobile styling */}
        <div className="flex-1 h-[300px] lg:h-auto min-h-[300px] relative">
          {loadingRoute ? (
            <div className="h-full flex items-center justify-center bg-gray-100">
              <Spinner size="md" />
            </div>
          ) : routeError ? (
            <div className="h-full flex items-center justify-center bg-gray-100 p-4 text-center">
              <div className="text-red-500">
                <FiAlertTriangle size={24} className="mx-auto mb-2" />
                <p>{routeError}</p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={[task.clientLocation.latitude, task.clientLocation.longitude]}
              zoom={14}
              className="h-full w-full absolute inset-0"
              whenCreated={(map) => {
                // Force a resize to ensure map tiles load properly
                setTimeout(() => {
                  map.invalidateSize();
                }, 100);
              }}
              touchZoom={true}
              doubleClickZoom={true}
              scrollWheelZoom={true}
              zoomControl={true}
              dragging={true}
            >
              <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {route && (
                <>
                  <Polyline
                    positions={route.coordinates.map(([lng, lat]) => [lat, lng])}
                    color="#3b82f6"
                    weight={4}
                  />
                  <AutoCenterMap route={route} />
                </>
              )}
              <Marker
                position={[task.clientLocation.latitude, task.clientLocation.longitude]}
                icon={clientIcon}
              />
              <Marker
                position={[location.lat, location.lng]}
                icon={workerIcon}
              />
            </MapContainer>
          )}
        </div>

        {/* Task Details Section */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Service Details</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700">Service Type</h3>
              <p className="text-gray-600">{task.category?.categoryName || "N/A"}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">Price</h3>
              <p className="text-gray-600">₹{task.category?.price || "N/A"}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">Client</h3>
              <p className="text-gray-600">
                {task.client?.firstName || "N/A"} {task.client?.lastName || ""}
              </p>
              {task.client?.phoneNo && (
                <p className="text-gray-600 text-sm mt-1">
                  Phone: {task.client.phoneNo}
                </p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">Location</h3>
              <p className="text-gray-600 flex items-start">
                <FiMapPin className="mr-2 mt-1 flex-shrink-0" />
                <span>{task.clientLocation?.address || "N/A"}</span>
              </p>
            </div>

            {task.instruction && (
              <div>
                <h3 className="font-semibold text-gray-700">Instructions</h3>
                <p className="text-gray-600">{task.instruction}</p>
              </div>
            )}

            {distance && duration && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-blue-800 text-sm">Distance</h3>
                  <p className="text-blue-600">{distance}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-blue-800 text-sm">Duration</h3>
                  <p className="text-blue-600">{duration}</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleAcceptTask}
            disabled={loadingRoute || routeError}
            className={`mt-6 w-full py-3 rounded-lg font-medium transition ${
              loadingRoute || routeError
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loadingRoute ? "Loading..." : routeError ? "Cannot Accept (Route Error)" : "Accept Service"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewAllServiceRequests;