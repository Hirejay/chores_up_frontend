/*
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-arrowheads";
import "leaflet-rotatedmarker"; // Import the rotated marker plugin
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./MapStyles.css"; // Add custom styles here

const motorcycleIcon = new L.Icon({
  iconUrl: "https://res.cloudinary.com/doqlcojpk/image/upload/v1742756388/CHORESUP/mapicon.webp",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const antennaIcon = new L.Icon({
  iconUrl: "https://res.cloudinary.com/doqlcojpk/image/upload/v1742750573/CHORESUP/homelogo.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Component to auto-center the map on the route
function AutoCenterMap({ route }) {
  const map = useMap();

  useEffect(() => {
    if (route?.geometry?.coordinates) {
      const bounds = L.latLngBounds(
        route.geometry.coordinates.map(([lng, lat]) => [lat, lng])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, map]);

  return null;
}

// Utility function to calculate the bearing between two points
function calculateBearing(start, end) {
  const startLat = (start.latitude * Math.PI) / 180;
  const startLng = (start.longitude * Math.PI) / 180;
  const endLat = (end.latitude * Math.PI) / 180;
  const endLng = (end.longitude * Math.PI) / 180;

  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360; // Normalize to 0-360 degrees
}

function ActiveServiceMap() {
  const { taskId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [route, setRoute] = useState(null);
  const [workerLocation, setWorkerLocation] = useState(null);
  const [clientLocation, setClientLocation] = useState(null);
  const [bearing, setBearing] = useState(0); // State to store the bearing
  const mapRef = useRef(null);
  const workerMarkerRef = useRef(null);

  useEffect(() => {
    if (!taskId) return;

    const fetchTaskAndRoute = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/location/get-route-active`,
          { taskId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("response",response.data);

        if (response.data.success) {
          const { task, geometry } = response.data;
          setClientLocation(task.clientLocation);
          setWorkerLocation(task.workerLocation);
          setRoute({ geometry });

          // Calculate bearing if there are at least two points in the route
          if (geometry.coordinates.length >= 2) {
            const start = {
              latitude: geometry.coordinates[0][1],
              longitude: geometry.coordinates[0][0],
            };
            const end = {
              latitude: geometry.coordinates[1][1],
              longitude: geometry.coordinates[1][0],
            };
            const newBearing = calculateBearing(start, end);
            setBearing(newBearing);
          }
        } else {
          console.error("Failed to fetch route:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchTaskAndRoute();
    const interval = setInterval(fetchTaskAndRoute, 10000);
    return () => clearInterval(interval);
  }, [taskId]);

  // Update worker marker rotation when bearing changes
  useEffect(() => {
    if (workerMarkerRef.current) {
      workerMarkerRef.current.setRotationAngle(bearing);
    }
  }, [bearing]);

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
          whenCreated={(map) => (mapRef.current = map)} // Store map reference
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={[clientLocation.latitude, clientLocation.longitude]} icon={antennaIcon} />
          <Marker
            position={[workerLocation.latitude, workerLocation.longitude]}
            icon={motorcycleIcon}
            ref={workerMarkerRef} // Ref to the worker marker
            rotationAngle={bearing} // Initial rotation angle
            rotationOrigin="center" // Rotate around the center of the icon
          />

          {route && (
            <>
              <Polyline
                positions={route.geometry.coordinates.map(([lng, lat]) => [lat, lng])}
                color="red"
                arrowheads={{ fill: true, size: "5px" }}
              />
              <AutoCenterMap route={route} />
            </>
          )}
        </MapContainer>
      )}
      
    </div>
    </div>
  );
}

export default ActiveServiceMap;
*/

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-arrowheads";
import "leaflet-rotatedmarker";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./MapStyles.css";

const motorcycleIcon = new L.Icon({
  iconUrl: "https://res.cloudinary.com/doqlcojpk/image/upload/v1742756388/CHORESUP/mapicon.webp",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const destinationIcon = new L.Icon({
  iconUrl: "https://res.cloudinary.com/doqlcojpk/image/upload/v1742750573/CHORESUP/homelogo.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

function AutoCenterMap({ route }) {
  const map = useMap();

  useEffect(() => {
    if (route?.geometry?.coordinates) {
      const bounds = L.latLngBounds(
        route.geometry.coordinates.map(([lng, lat]) => [lat, lng])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, map]);

  return null;
}

function calculateBearing(start, end) {
  const startLat = (start.latitude * Math.PI) / 180;
  const startLng = (start.longitude * Math.PI) / 180;
  const endLat = (end.latitude * Math.PI) / 180;
  const endLng = (end.longitude * Math.PI) / 180;

  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

function ClientServiceMap() {
  const { taskId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [route, setRoute] = useState(null);
  const [workerLocation, setWorkerLocation] = useState(null);
  const [clientLocation, setClientLocation] = useState(null);
  const [bearing, setBearing] = useState(0);
  const [distance, setDistance] = useState("--");
  const [duration, setDuration] = useState("--");
  
  const workerMarkerRef = useRef(null);

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
          setRoute({ geometry });
          setDistance(distance || "--");
          setDuration(duration || "--");

          if (geometry.coordinates.length >= 2) {
            const start = {
              latitude: geometry.coordinates[0][1],
              longitude: geometry.coordinates[0][0],
            };
            const end = {
              latitude: geometry.coordinates[1][1],
              longitude: geometry.coordinates[1][0],
            };
            setBearing(calculateBearing(start, end));
          }
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchTaskAndRoute();
    const interval = setInterval(fetchTaskAndRoute, 10000);
    return () => clearInterval(interval);
  }, [taskId]);

  useEffect(() => {
    if (workerMarkerRef.current) {
      workerMarkerRef.current.setRotationAngle(bearing);
    }
  }, [bearing]);

  return (
    <div className="client-map-container">
      <div className="map-header">
        <Link to=".." className="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </Link>
        <div className="route-info">
          <div className="info-box">
            <span className="label">Distance</span>
            <span className="value">{distance}</span>
          </div>
          <div className="info-box">
            <span className="label">Time</span>
            <span className="value">{duration}</span>
          </div>
        </div>
      </div>

      <div className="map-wrapper">
        {clientLocation && workerLocation && (
          <MapContainer
            center={[workerLocation.latitude, workerLocation.longitude]}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <Marker 
              position={[clientLocation.latitude, clientLocation.longitude]} 
              icon={destinationIcon} 
            />

            <Marker
              position={[workerLocation.latitude, workerLocation.longitude]}
              icon={motorcycleIcon}
              ref={workerMarkerRef}
              rotationAngle={bearing}
              rotationOrigin="center"
            />

            {route && (
              <>
                <Polyline
                  positions={route.geometry.coordinates.map(([lng, lat]) => [lat, lng])}
                  color="#4285F4"
                  weight={5}
                  opacity={0.8}
                  arrowheads={{ fill: true, size: "10px" }}
                />
                <AutoCenterMap route={route} />
              </>
            )}
          </MapContainer>
        )}
      </div>
    </div>
  );
}

export default ClientServiceMap;