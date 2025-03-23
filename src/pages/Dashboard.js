import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user) || JSON.parse(localStorage.getItem("user")); // Get user from Redux store

  if (!user) {
    
    return <Navigate to="/login" replace />;
  }

  switch (user.accountType) {
    case "client":
      return <Navigate to="/dashboard/client" replace />;
    case "worker":
      return <Navigate to="/dashboard/worker" replace />;
    case "admin":
      return <Navigate to="/dashboard/admin" replace />;
    default:
      toast.error("You do not have permission to access this page.");
      return <Navigate to="/" replace />;
  }
};

export default Dashboard;
