
/*import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-arrowheads";
import "leaflet-rotate";
import { useParams, Link  } from "react-router-dom";
import { useSelector } from "react-redux";
import "./MapStyles.css"; // Add custom styles here
import toast from "react-hot-toast";

const motorcycleIcon = (bearing) =>
  new L.Icon({
    iconUrl: "https://res.cloudinary.com/doqlcojpk/image/upload/v1742756388/CHORESUP/mapicon.webp",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    className: `rotate-icon`,
  });

const antennaIcon = new L.Icon({
  iconUrl: "https://res.cloudinary.com/doqlcojpk/image/upload/v1742750573/CHORESUP/homelogo.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

function ViewActiveServiceMap() {
  const { taskId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [route, setRoute] = useState(null);
  const [workerLocation, setWorkerLocation] = useState(null);
  const [clientLocation, setClientLocation] = useState(null);
  const [workerBearing, setWorkerBearing] = useState(0);

  const mapRef = useRef(null);
  const workerMarkerRef = useRef(null);

  const calculateBearing = (start, end) => {
    const startLat = (start.latitude * Math.PI) / 180;
    const startLng = (start.longitude * Math.PI) / 180;
    const endLat = (end.latitude * Math.PI) / 180;
    const endLng = (end.longitude * Math.PI) / 180;

    const y = Math.sin(endLng - startLng) * Math.cos(endLat);
    const x =
      Math.cos(startLat) * Math.sin(endLat) -
      Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    return (bearing + 360) % 360;
  };

  useEffect(() => {
    if (workerLocation && mapRef.current) {
      mapRef.current.setView([workerLocation.latitude, workerLocation.longitude]);

      if (route && route.geometry.coordinates.length > 1) {
        const nextPoint = route.geometry.coordinates[1];
        const bearing = calculateBearing(workerLocation, {
          latitude: nextPoint[1],
          longitude: nextPoint[0],
        });
        setWorkerBearing(bearing);
        mapRef.current.setBearing(bearing);

        if (workerMarkerRef.current) {
          workerMarkerRef.current.setIcon(motorcycleIcon(bearing));
        }
      }
    }
  }, [workerLocation, route]);

  useEffect(() => {
    if (!taskId) return;

    const fetchTaskAndRoute = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/location/get-route-active`,
          { taskId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          const { task, geometry, distance, duration } = response.data;
          setClientLocation(task.clientLocation);
          setWorkerLocation(task.workerLocation);
          setRoute({
            geometry: geometry,
            distance: distance,
            duration: duration,
          });
        } else {
        
          toast.error("Failed to fetch route:", response.data.error);
        }
      } catch (error) {
        
        toast.error("Error fetching route:", error);
      }
    };

    fetchTaskAndRoute();
    const interval = setInterval(fetchTaskAndRoute, 10000);
    return () => clearInterval(interval);
  }, [taskId]);

  return (
    <div className="map-page">
    <Link to=".." className="mt-4 text-blue-600">
        ← Back to Active Services
    </Link>
    <div className="map-container">
      {clientLocation && workerLocation && (
        <MapContainer
          center={[workerLocation.latitude, workerLocation.longitude]}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
          rotate={true}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={[clientLocation.latitude, clientLocation.longitude]} icon={antennaIcon} />

          <Marker
            position={[workerLocation.latitude, workerLocation.longitude]}
            icon={motorcycleIcon(workerBearing)}
            ref={workerMarkerRef}
          />

          {route && (
            <Polyline
              positions={route.geometry.coordinates.map(([lng, lat]) => [lat, lng])}
              color="red"
              arrowheads={{ fill: true, size: "5px" }}
            />
          )}
        </MapContainer>
      )}
      
    </div>
    </div>
  );
}

export default ViewActiveServiceMap;

*/


/*  // all intsruction
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-arrowheads";
import "leaflet-rotate";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./MapStyles.css";
import toast from "react-hot-toast";

const motorcycleIcon = (bearing) =>
  new L.Icon({
    iconUrl:
      "https://res.cloudinary.com/doqlcojpk/image/upload/v1742756388/CHORESUP/mapicon.webp",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    className: `rotate-icon`,
  });

const antennaIcon = new L.Icon({
  iconUrl:
    "https://res.cloudinary.com/doqlcojpk/image/upload/v1742750573/CHORESUP/homelogo.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

function ViewActiveServiceMap() {
  const { taskId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [route, setRoute] = useState(null);
  const [workerLocation, setWorkerLocation] = useState(null);
  const [clientLocation, setClientLocation] = useState(null);
  const [workerBearing, setWorkerBearing] = useState(0);
  const [steps, setSteps] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);

  const mapRef = useRef(null);
  const workerMarkerRef = useRef(null);

  const calculateBearing = (start, end) => {
    const startLat = (start.latitude * Math.PI) / 180;
    const startLng = (start.longitude * Math.PI) / 180;
    const endLat = (end.latitude * Math.PI) / 180;
    const endLng = (end.longitude * Math.PI) / 180;

    const y = Math.sin(endLng - startLng) * Math.cos(endLat);
    const x =
      Math.cos(startLat) * Math.sin(endLat) -
      Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    return (bearing + 360) % 360;
  };

  useEffect(() => {
    if (workerLocation && mapRef.current) {
      mapRef.current.setView([
        workerLocation.latitude,
        workerLocation.longitude,
      ]);

      if (route && route.geometry.coordinates.length > 1) {
        const nextPoint = route.geometry.coordinates[1];
        const bearing = calculateBearing(workerLocation, {
          latitude: nextPoint[1],
          longitude: nextPoint[0],
        });
        setWorkerBearing(bearing);
        mapRef.current.setBearing(bearing);

        if (workerMarkerRef.current) {
          workerMarkerRef.current.setIcon(motorcycleIcon(bearing));
        }
      }
    }
  }, [workerLocation, route]);

  useEffect(() => {
    if (!taskId) return;

    const fetchTaskAndRoute = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/location/get-route-active`,
          { taskId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          const { task, geometry, distance, duration, steps } = response.data;
          setClientLocation(task.clientLocation);
          setWorkerLocation(task.workerLocation);
          setRoute({
            geometry: geometry,
            distance: distance,
            duration: duration,
          });
          setSteps(steps);
        } else {
          toast.error("Failed to fetch route:", response.data.error);
        }
      } catch (error) {
        toast.error("Error fetching route:", error);
      }
    };

    fetchTaskAndRoute();
    const interval = setInterval(fetchTaskAndRoute, 10000);
    return () => clearInterval(interval);
  }, [taskId]);

  const handleStepClick = (step, index) => {
    setSelectedStep(index);
    if (step.location && mapRef.current) {
      mapRef.current.flyTo([step.location.lat, step.location.lng], 16);
    }
  };

  return (
    <div className="google-maps-style">
      <div className="header">
        <Link to=".." className="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          <span>Back to Active Services</span>
        </Link>
        <h1 className="title">Service Route</h1>
      </div>

      <div className="map-container">
        {clientLocation && workerLocation && (
          <MapContainer
            center={[workerLocation.latitude, workerLocation.longitude]}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
            rotate={true}
          >
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <Marker
              position={[clientLocation.latitude, clientLocation.longitude]}
              icon={antennaIcon}
            />

            <Marker
              position={[workerLocation.latitude, workerLocation.longitude]}
              icon={motorcycleIcon(workerBearing)}
              ref={workerMarkerRef}
            />

            {route && (
              <Polyline
                positions={route.geometry.coordinates.map(([lng, lat]) => [lat, lng])}
                color="#4285F4"
                weight={5}
                opacity={0.8}
                arrowheads={{ fill: true, size: "10px", frequency: "20%" }}
              />
            )}
          </MapContainer>
        )}
      </div>

      <div className="directions-panel">
        <div className="directions-header">
          <h2>Directions</h2>
          {route && (
            <div className="route-summary">
              <span className="distance">{route.distance}</span>
              <span className="duration">{route.duration}</span>
            </div>
          )}
        </div>

        <div className="steps-container">
          {steps && steps.length > 0 ? (
            <ol className="steps-list">
              {steps.map((step, index) => (
                <li 
                  key={index} 
                  className={`step-item ${selectedStep === index ? 'active' : ''}`}
                  onClick={() => handleStepClick(step, index)}
                >
                  <div className="step-marker">
                    <div className="step-number">{index + 1}</div>
                    {index < steps.length - 1 && <div className="step-line"></div>}
                  </div>
                  <div className="step-content">
                    <div className="instruction">{step.instruction}</div>
                    <div className="step-meta">
                      <span className="distance">{step.distance}</span>
                      <span className="duration">{step.duration}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="no-directions">No directions available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewActiveServiceMap;
*/


/*
//single istruction
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-arrowheads";
import "leaflet-rotate";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./MapStyles.css";
import toast from "react-hot-toast";

const motorcycleIcon = (bearing) =>
  new L.Icon({
    iconUrl:
      "https://res.cloudinary.com/doqlcojpk/image/upload/v1742756388/CHORESUP/mapicon.webp",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    className: `rotate-icon`,
  });

const antennaIcon = new L.Icon({
  iconUrl:
    "https://res.cloudinary.com/doqlcojpk/image/upload/v1742750573/CHORESUP/homelogo.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

function ViewActiveServiceMap() {
  const { taskId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [route, setRoute] = useState(null);
  const [workerLocation, setWorkerLocation] = useState(null);
  const [clientLocation, setClientLocation] = useState(null);
  const [workerBearing, setWorkerBearing] = useState(0);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const mapRef = useRef(null);
  const workerMarkerRef = useRef(null);

  const calculateBearing = (start, end) => {
    const startLat = (start.latitude * Math.PI) / 180;
    const startLng = (start.longitude * Math.PI) / 180;
    const endLat = (end.latitude * Math.PI) / 180;
    const endLng = (end.longitude * Math.PI) / 180;

    const y = Math.sin(endLng - startLng) * Math.cos(endLat);
    const x =
      Math.cos(startLat) * Math.sin(endLat) -
      Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    return (bearing + 360) % 360;
  };

  useEffect(() => {
    if (workerLocation && mapRef.current) {
      mapRef.current.setView([
        workerLocation.latitude,
        workerLocation.longitude,
      ]);

      if (route && route.geometry.coordinates.length > 1) {
        const nextPoint = route.geometry.coordinates[1];
        const bearing = calculateBearing(workerLocation, {
          latitude: nextPoint[1],
          longitude: nextPoint[0],
        });
        setWorkerBearing(bearing);
        mapRef.current.setBearing(bearing);

        if (workerMarkerRef.current) {
          workerMarkerRef.current.setIcon(motorcycleIcon(bearing));
        }
      }
    }
  }, [workerLocation, route]);

  useEffect(() => {
    if (!taskId) return;

    const fetchTaskAndRoute = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/location/get-route-active`,
          { taskId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          const { task, geometry, distance, duration, steps } = response.data;
          setClientLocation(task.clientLocation);
          setWorkerLocation(task.workerLocation);
          setRoute({
            geometry: geometry,
            distance: distance,
            duration: duration,
          });
          setSteps(steps);
        } else {
          toast.error("Failed to fetch route:", response.data.error);
        }
      } catch (error) {
        toast.error("Error fetching route:", error);
      }
    };

    fetchTaskAndRoute();
    const interval = setInterval(fetchTaskAndRoute, 10000);
    return () => clearInterval(interval);
  }, [taskId]);

  const currentStep = steps[currentStepIndex] || {};

  return (
    <div className="navigation-view">
      <div className="header">
        <Link to=".." className="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </Link>
        <div className="route-info">
          {route && (
            <div className="route-summary">
              <span className="distance">{route.distance}</span>
              <span className="duration">{route.duration}</span>
            </div>
          )}
        </div>
      </div>

      <div className="current-instruction">
        <div className="step-number">{currentStepIndex + 1}</div>
        <div className="instruction-content">
          <div className="instruction-text">{currentStep.instruction || "Calculating route..."}</div>
          <div className="step-meta">
            <span className="distance">{currentStep.distance}</span>
            <span className="duration">{currentStep.duration}</span>
          </div>
        </div>
      </div>

      <div className="map-container">
        {clientLocation && workerLocation && (
          <MapContainer
            center={[workerLocation.latitude, workerLocation.longitude]}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
            rotate={true}
          >
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <Marker
              position={[clientLocation.latitude, clientLocation.longitude]}
              icon={antennaIcon}
            />

            <Marker
              position={[workerLocation.latitude, workerLocation.longitude]}
              icon={motorcycleIcon(workerBearing)}
              ref={workerMarkerRef}
            />

            {route && (
              <Polyline
                positions={route.geometry.coordinates.map(([lng, lat]) => [lat, lng])}
                color="#4285F4"
                weight={5}
                opacity={0.8}
                arrowheads={{ fill: true, size: "10px", frequency: "20%" }}
              />
            )}
          </MapContainer>
        )}
      </div>
    </div>
  );
}

export default ViewActiveServiceMap;

*/




// full screen solution for map
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-arrowheads";
import "leaflet-rotate";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./MapStyles.css";
import toast from "react-hot-toast";

const motorcycleIcon = (bearing) =>
  new L.Icon({
    iconUrl:
      "https://res.cloudinary.com/doqlcojpk/image/upload/v1742756388/CHORESUP/mapicon.webp",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    className: `rotate-icon`,
  });

const antennaIcon = new L.Icon({
  iconUrl:
    "https://res.cloudinary.com/doqlcojpk/image/upload/v1742750573/CHORESUP/homelogo.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

function ViewActiveServiceMap() {
  const { taskId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [route, setRoute] = useState(null);
  const [workerLocation, setWorkerLocation] = useState(null);
  const [clientLocation, setClientLocation] = useState(null);
  const [workerBearing, setWorkerBearing] = useState(0);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const mapRef = useRef(null);
  const workerMarkerRef = useRef(null);
  const containerRef = useRef(null);

  const calculateBearing = (start, end) => {
    const startLat = (start.latitude * Math.PI) / 180;
    const startLng = (start.longitude * Math.PI) / 180;
    const endLat = (end.latitude * Math.PI) / 180;
    const endLng = (end.longitude * Math.PI) / 180;

    const y = Math.sin(endLng - startLng) * Math.cos(endLat);
    const x =
      Math.cos(startLat) * Math.sin(endLat) -
      Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    return (bearing + 360) % 360;
  };

  useEffect(() => {
    if (workerLocation && mapRef.current) {
      mapRef.current.setView([
        workerLocation.latitude,
        workerLocation.longitude,
      ]);

      if (route && route.geometry.coordinates.length > 1) {
        const nextPoint = route.geometry.coordinates[1];
        const bearing = calculateBearing(workerLocation, {
          latitude: nextPoint[1],
          longitude: nextPoint[0],
        });
        setWorkerBearing(bearing);
        mapRef.current.setBearing(bearing);

        if (workerMarkerRef.current) {
          workerMarkerRef.current.setIcon(motorcycleIcon(bearing));
        }
      }
    }
  }, [workerLocation, route]);

  useEffect(() => {
    if (!taskId) return;

    const fetchTaskAndRoute = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/location/get-route-active`,
          { taskId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          const { task, geometry, distance, duration, steps } = response.data;
          setClientLocation(task.clientLocation);
          setWorkerLocation(task.workerLocation);
          setRoute({
            geometry: geometry,
            distance: distance,
            duration: duration,
          });
          setSteps(steps);
        } else {
          toast.error("Failed to fetch route:", response.data.error);
        }
      } catch (error) {
        toast.error("Error fetching route:", error);
      }
    };

    fetchTaskAndRoute();
    const interval = setInterval(fetchTaskAndRoute, 10000);
    return () => clearInterval(interval);
  }, [taskId]);

  const currentStep = steps[currentStepIndex] || {};

  return (
    <div className="navigation-container" ref={containerRef}>
      <div className="navigation-header">
        <Link to=".." className="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </Link>
        <div className="route-summary">
          <span className="distance">{route?.distance || '--'}</span>
          <span className="duration">{route?.duration || '--'}</span>
        </div>
      </div>

      <div className="current-step">
        <div className="step-number">{currentStepIndex + 1}</div>
        <div className="step-content">
          <div className="instruction">{currentStep.instruction || "Calculating route..."}</div>
          <div className="step-meta">
            <span className="distance">{currentStep.distance || '--'}</span>
            <span className="duration">{currentStep.duration || '--'}</span>
          </div>
        </div>
      </div>

      <div className="map-wrapper">
        {clientLocation && workerLocation && (
          <MapContainer
            center={[workerLocation.latitude, workerLocation.longitude]}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
            rotate={true}
          >
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <Marker
              position={[clientLocation.latitude, clientLocation.longitude]}
              icon={antennaIcon}
            />

            <Marker
              position={[workerLocation.latitude, workerLocation.longitude]}
              icon={motorcycleIcon(workerBearing)}
              ref={workerMarkerRef}
            />

            {route && (
              <Polyline
                positions={route.geometry.coordinates.map(([lng, lat]) => [lat, lng])}
                color="#4285F4"
                weight={5}
                opacity={0.8}
                arrowheads={{ fill: true, size: "10px", frequency: "20%" }}
              />
            )}
          </MapContainer>
        )}
      </div>
    </div>
  );
}

export default ViewActiveServiceMap;