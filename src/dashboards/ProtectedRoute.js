import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowed }) => {
  const user = useSelector((state) => state.auth.user) || JSON.parse(localStorage.getItem("user")); // Get user from Redux store
  console.log("User from Redux:", user);  

  if (!user) {
    
    return <Navigate to="/login" replace />;
  }

  if (allowed.includes(user.accountType)) {
    return <Outlet />;
  }

  toast.error("You do not have permission to access this page.");
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
