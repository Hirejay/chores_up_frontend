import { useState } from "react";
import { motion } from "framer-motion";
import { X, Menu, Plus, List, Clock, History,ShieldUser,RectangleEllipsis} from "lucide-react";
import { Link, Outlet, Route, Routes } from "react-router-dom";

export default function ClientDashboard() {
  const [isOpen, setIsOpen] = useState(false);

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
          <NavItem to="create-service-post" icon={<Plus />} text="Create Service Post" />
          <NavItem to="view-requested-service-posts" icon={<List />} text="View Requested Service Posts" />
          <NavItem to="active-service-posts" icon={<Clock />} text="Active Service Posts" />
          <NavItem to="past-services" icon={<History />} text="Past Services" />
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 md:ml-72">
        <motion.button
          className="md:hidden focus:outline-none transition-transform transform hover:scale-110"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </motion.button>

        <h1>cient dashboard</h1>
        <Outlet></Outlet>
        
        
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

