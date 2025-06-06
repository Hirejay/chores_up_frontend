import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";
import { 
  FiUser, 
  FiMail, 
  FiBriefcase, 
  FiTag, 
  FiCheck, 
  FiX,
  FiAlertCircle,
  FiClock
} from "react-icons/fi";

export default function ViewWorkerRequests() {
  const [workerRequests, setWorkerRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchWorkerRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/admin/profiles-pending`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setWorkerRequests(response.data?.pendingProfiles || []);
        toast.success('Worker requests loaded successfully', {
          icon: <FiCheck className="text-green-500" />
        });
      } catch (error) {
        setError("Failed to fetch worker requests");
        toast.error("Failed to fetch worker requests", {
          icon: <FiAlertCircle className="text-red-500" />
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerRequests();
  }, [token]);

  const handleAccept = async (id) => {
    setProcessingId(id);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/admin/profiles-accept`,
        { profileId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWorkerRequests(prev => prev.filter(worker => worker._id !== id));
      toast.success("Worker request accepted", {
        icon: <FiCheck className="text-green-500" />
      });
    } catch (error) {
      toast.error("Error accepting request", {
        icon: <FiAlertCircle className="text-red-500" />
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/admin/profiles-reject`,
        { profileId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWorkerRequests(prev => prev.filter(worker => worker._id !== id));
      toast.success("Worker request rejected", {
        icon: <FiCheck className="text-green-500" />
      });
    } catch (error) {
      toast.error("Error rejecting request", {
        icon: <FiAlertCircle className="text-red-500" />
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
          <div className="flex items-center">
            <FiAlertCircle className="mr-2" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          Worker Registration Requests
        </h1>

        {workerRequests.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiUser className="mr-2" />
                        Worker
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiMail className="mr-2" />
                        Email
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiBriefcase className="mr-2" />
                        Experience
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiTag className="mr-2" />
                        Categories
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {workerRequests.map((profile) => (
                    <tr key={profile._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <FiUser className="text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {profile.worker?.firstName} {profile.worker?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {profile.worker?.phoneNo || 'No phone'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {profile.worker?.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {profile.experience || 'N/A'} years
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {Array.isArray(profile.categorys) && profile.categorys.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {profile.categorys.slice(0, 3).map((cat, index) => (
                              <span 
                                key={index} 
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                              >
                                {cat.categoryName}
                              </span>
                            ))}
                            {profile.categorys.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{profile.categorys.length - 3} more
                              </span>
                            )}
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {profile.profileStatus === "pending" ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAccept(profile._id)}
                              disabled={processingId === profile._id}
                              className={`flex items-center px-3 py-1 rounded-md transition-colors ${
                                processingId === profile._id
                                  ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                                  : 'bg-green-500 text-white hover:bg-green-600'
                              }`}
                            >
                              <FiCheck className="mr-1" />
                              {processingId === profile._id ? 'Processing...' : 'Accept'}
                            </button>
                            <button
                              onClick={() => handleReject(profile._id)}
                              disabled={processingId === profile._id}
                              className={`flex items-center px-3 py-1 rounded-md transition-colors ${
                                processingId === profile._id
                                  ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                                  : 'bg-red-500 text-white hover:bg-red-600'
                              }`}
                            >
                              <FiX className="mr-1" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            profile.profileStatus === "accepted"
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {profile.profileStatus}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <FiClock className="mx-auto text-4xl text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Pending Requests
            </h2>
            <p className="text-gray-500">
              There are currently no worker registration requests to review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}