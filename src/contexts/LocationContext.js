import { createContext, useState, useEffect } from "react";

// Create a context for location data
export const LocationContext = createContext();

// Create a provider component
export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(() => {
    // Initialize location from localStorage
    const savedLocation = JSON.parse(localStorage.getItem("location"));
    return savedLocation || { lat: null, lng: null }; // Default to { lat: null, lng: null }
  });
  const [isTracking, setIsTracking] = useState(() => {
    // Initialize tracking state from localStorage
    const savedIsTracking = JSON.parse(localStorage.getItem("isTracking"));
    return savedIsTracking || false;
  });
  const [watchId, setWatchId] = useState(null);

  // Start location tracking
  const startTracking = () => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setLocation(newLocation); // Update context
          localStorage.setItem("location", JSON.stringify(newLocation)); // Persist location data
        },
        (error) => {
          console.error("Error fetching location:", error);
          stopTracking(); // Stop tracking on error
        }
      );
      setWatchId(id);
      setIsTracking(true);
      localStorage.setItem("isTracking", JSON.stringify(true)); // Persist tracking state
    } else {
      console.error("Geolocation is not supported by your browser.");
    }
  };

  // Stop location tracking
  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId); // Clear the watchPosition
      setWatchId(null);
    }
    setIsTracking(false);
    setLocation({ lat: null, lng: null });
    localStorage.setItem("isTracking", JSON.stringify(false)); // Persist tracking state
    localStorage.removeItem("location"); // Clear location data
  };

  // Initialize tracking on component mount
  useEffect(() => {
    if (isTracking) {
      startTracking();
    }
  }, []); // Run only once on mount

  return (
    <LocationContext.Provider value={{ location, setLocation, isTracking, setIsTracking, startTracking, stopTracking }}>
      {children}
    </LocationContext.Provider>
  );
};