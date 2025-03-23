import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function ViewWorkerRequests() {
  const [workerRequests, setWorkerRequests] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchWorkerRequests = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/admin/profiles-pending`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

       
        setWorkerRequests(response.data?.pendingProfiles || []);
      } catch (error) {
       
        toast.error("Failed to fetch worker requests");
        setWorkerRequests([]);
      }
    };

    fetchWorkerRequests();
  }, [token]);

  const handleAccept = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/admin/profiles-accept`,
        { profileId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWorkerRequests((prev) =>
        prev.map((worker) =>
          worker._id === id ? { ...worker, profileStatus: "accepted" } : worker
        )
      );
      toast.success("Worker request accepted successfully");
    } catch (error) {
      toast.error("Error accepting worker request");
      
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/admin/profiles-reject`,
        { profileId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWorkerRequests((prev) =>
        prev.map((worker) =>
          worker._id === id ? { ...worker, profileStatus: "rejected" } : worker
        )
      );
      toast.success("Worker request rejected successfully");
    } catch (error) {
      toast.error("Error rejecting worker request");
   
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">View Worker Requests</h2>
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
            {workerRequests.map((profile) => (
              <tr key={profile._id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-sm text-gray-800">
                  {profile.worker?.firstName} {profile.worker?.lastName}
                </td>
                <td className="py-4 px-4 text-sm text-gray-800">{profile.worker?.email}</td>
                <td className="py-4 px-4 text-sm text-gray-800">{profile.experience}</td>
                <td className="py-4 px-4 text-sm text-gray-800">
                  {Array.isArray(profile.categorys) && profile.categorys.length > 0
                    ? profile.categorys.map((cat) => cat.categoryName).join(", ")
                    : "N/A"}
                </td>
                <td className="py-4 px-4 text-sm">
                  {profile.profileStatus === "pending" && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAccept(profile._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(profile._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {profile.profileStatus === "accepted" && (
                    <span className="text-green-600 font-semibold">Accepted</span>
                  )}
                  {profile.profileStatus === "rejected" && (
                    <span className="text-red-600 font-semibold">Rejected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}