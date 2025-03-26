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

      if (response.data?.route) {
        setRoute(response.data.route.geometry);
        setDistance(response.data.route.distance);
        setDuration(response.data.route.duration);
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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-2xl"
        >
          ❌
        </button>

        {/* Map Section (Left Side) */}
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

        {/* Task Details Section (Right Side) */}
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
            {/* Display Distance and Duration */}
            <p className="text-lg">
              <strong>Distance:</strong> {distance}
            </p>
            <p className="text-lg">
              <strong>Duration:</strong> {duration}
            </p>
          </div>

          {/* Accept Task Button */}
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