import { useEffect, useContext, useRef } from "react";
import { Outlet } from "react-router-dom";
import { LocationContext } from "../../contexts/LocationContext"; // Adjust the import path
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

function ViewActive() {
  const { location, isTracking } = useContext(LocationContext); // Access location and tracking state
 
  const lastUpdateTime = useRef(Date.now()); // Track the last time the API was called
  const { token } = useSelector((state) => state.auth);

  // Function to update worker's location
  const updateWorkerLocation = async (latitude, longitude) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/task/updatelocation`, {
        latitude,
        longitude,
      },{
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success){
        
        toast.error("Failed to update worker location:", response.data.message);
      }
    } catch (error) {
      
      toast.error("Error updating worker location:", error);
    }
  };

  // Debounced useEffect to reduce frequent updates
  useEffect(() => {
    if (isTracking && location.lat && location.lng) {
      const now = Date.now();
      if (now - lastUpdateTime.current >= 10000) {
        // Check if 10 seconds have passed since the last update
       
        updateWorkerLocation(location.lat, location.lng);
        lastUpdateTime.current = now; // Update the last update time
      }
    }
  }, [isTracking, location]);


 

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default ViewActive;