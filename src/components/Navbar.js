import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { Menu, X } from "lucide-react";
import householdlogo from "../assets/householdlogo.jpg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const handleLogout = async () => {
      try {
        

          const response = await axios.post(
              `${process.env.REACT_APP_API_BASE_URL}/auth/logout`,
              {},
              {
                  headers: {
                      Authorization: `Bearer ${token}`, // ✅ Send token in headers
                  },
              }
          );

         

          dispatch(logout()); // 🔥 Clear Redux state
          localStorage.removeItem("reduxState"); // 🔥 Ensure all stored state is cleared

          toast.success("Logged out successfully");
          navigate("/login");
      } catch (error) {
       
          toast.error("Logout failed");
      }
  };


  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg h-16 rounded-b-2xl fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center h-full">
        <h1 className="text-2xl font-bold transition-transform transform hover:scale-105">
          <Link to="/">
            <img src={householdlogo} alt="Logo" className="w-12 h-12 rounded-full" />
          </Link>
        </h1>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none transition-transform transform hover:scale-110"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navbar Links */}
        <ul
          className={`md:flex md:space-x-6 absolute md:static bg-gray-900 w-full md:w-auto top-16 left-0 md:flex-row flex-col md:items-center transition-all duration-300 ease-in-out ${
            isOpen ? "block" : "hidden"
          } md:flex`}
        >
          <li className="py-2 px-4 hover:bg-gray-700 md:hover:bg-transparent transition-colors duration-200 rounded-lg">
            <Link to="/">Home</Link>
          </li>
          {/* <li className="py-2 px-4 hover:bg-gray-700 md:hover:bg-transparent transition-colors duration-200 rounded-lg">
            <Link to="/ContactUs">Contact Us</Link>
          </li> */}
          <li className="py-2 px-4 hover:bg-gray-700 md:hover:bg-transparent transition-colors duration-200 rounded-lg">
            <Link to="/AboutUs">About Us</Link>
          </li>

          {token ? (
            <>
              <li className="py-2 px-4 hover:bg-gray-700 md:hover:bg-transparent transition-colors duration-200 rounded-lg">
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li
                onClick={handleLogout}
                className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </li>
            </>
          ) : (
            <>
              <li className="py-2 px-4 hover:bg-gray-700 md:hover:bg-transparent transition-colors duration-200 rounded-lg">
                <Link to="/register">Register</Link>
              </li>
              <li className="py-2 px-4 hover:bg-gray-700 md:hover:bg-transparent transition-colors duration-200 rounded-lg">
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
