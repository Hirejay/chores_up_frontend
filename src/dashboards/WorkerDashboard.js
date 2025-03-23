import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { X, Menu, List, Clock, History, MapPin, ShieldUser,RectangleEllipsis } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { LocationContext } from "../contexts/LocationContext";

export default function WorkerDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const { location, isTracking, startTracking, stopTracking } = useContext(LocationContext); // Use context

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <motion.aside
        className={`bg-gray-800 text-white w-64 md:w-72 h-full fixed left-0 z-50 transform rounded-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out m-3 p-2 shadow-lg`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <button className="md:hidden" onClick={() => setIsOpen(false)}>
            <X size={28} />
          </button>
        </div>
        <nav className="p-4 space-y-4">
          <NavItem to="" icon={<RectangleEllipsis />} text="Change Password" />
          <NavItem to="profile" icon={<ShieldUser/>} text="Profile"/>
          <NavItem to="view-all-service-requests" icon={<List />} text="View Requested Service Posts" />
          <NavItem to="view-active-service" icon={<Clock />} text="Active Service Posts" />
          <NavItem to="history-services" icon={<History />} text="Past Services" />
        </nav>

        {/* Location Tracking Section */}
        <div className="p-4 border-t border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Location Tracking</h3>
          {isTracking ? (
            <button
              onClick={stopTracking}
              className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all"
            >
              <MapPin size={20} />
              <span>Stop Tracking</span>
            </button>
          ) : (
            <button
              onClick={startTracking}
              className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all"
            >
              <MapPin size={20} />
              <span>Start Tracking</span>
            </button>
          )}
          {location.lat !== null && location.lng !== null && (
            <div className="mt-4 text-sm">
              <p><strong>Latitude:</strong> {location.lat.toFixed(6)}</p>
              <p><strong>Longitude:</strong> {location.lng.toFixed(6)}</p>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 md:ml-72">
        <motion.button
          className="md:hidden focus:outline-none transition-transform transform hover:scale-110"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </motion.button>

        
        <Outlet /> {/* Child pages will render here */}
      </div>
    </div>
  );
}

// Sidebar Item Component
function NavItem({ to, icon, text }) {
  return (
    <Link to={`${to}`} className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded cursor-pointer">
      {icon}
      <span>{text}</span>
    </Link>
  );
}