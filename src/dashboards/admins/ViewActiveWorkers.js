import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";

export default function ViewActiveWorkers() {
  const [activeWorkers, setActiveWorkers] = useState([]);
   const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  // Fetch active workers from the API
  useEffect(() => {
    const fetchActiveWorkers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/admin/profiles-accepted`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
       
        setActiveWorkers(response.data.acceptedProfiles || []);
      } catch (error) {
        console.error("Error fetching active workers:", error);
        toast.error("Failed to fetch active workers");
      }finally {
        setLoading(false);
      }
    };

    fetchActiveWorkers();
  }, [token]);

  // Handle Reject button click
  const handleReject = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/admin/profiles-reject`,
        { profileId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setActiveWorkers((prev) =>
        prev.filter((worker) => worker._id !== id)
      );
      toast.success("Worker rejected successfully");
    } catch (error) {
     
      toast.error("Error rejecting worker");
    }
  };

  if (loading) {
      return <Spinner/>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">View Active Workers</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Experience
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Categories
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {activeWorkers.map((worker) => (
              <tr key={worker._id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-sm text-gray-800">
                  {worker.worker?.firstName} {worker.worker?.lastName}
                </td>
                <td className="py-4 px-4 text-sm text-gray-800">{worker.worker?.email}</td>
                <td className="py-4 px-4 text-sm text-gray-800">{worker.experience}</td>
                <td className="py-4 px-4 text-sm text-gray-800">
                  {Array.isArray(worker.categorys) && worker.categorys.length > 0
                    ? worker.categorys.map((cat) => cat.categoryName).join(", ")
                    : "N/A"}
                </td>
                <td className="py-4 px-4 text-sm">
                  <button
                    onClick={() => handleReject(worker._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}