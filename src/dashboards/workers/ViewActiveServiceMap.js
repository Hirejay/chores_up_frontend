
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-arrowheads";
import "leaflet-rotate";
import { useParams, Link  } from "react-router-dom";
import { useSelector } from "react-redux";
import "./MapStyles.css"; // Add custom styles here

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
