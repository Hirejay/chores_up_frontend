import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function ViewEPFO() {
  const [zeroFeesWorkers, setZeroFeesWorkers] = useState([]);
  const [nonZeroFeesWorkers, setNonZeroFeesWorkers] = useState([]);
  const [epfoDecreaseAmount, setEpfoDecreaseAmount] = useState({});
  const { token } = useSelector((state) => state.auth);

  // Fetch workers from the API
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/epfo/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

 

        if (response.data.success) {
          setZeroFeesWorkers(response.data.zeroFees || []);
          setNonZeroFeesWorkers(response.data.nonZeroFees || []);
          toast.success("Data fetched successfully");
        } else {
          toast.error("Failed to fetch EPFO worker details.");
        }
      } catch (error) {
        
        toast.error("Failed to fetch EPFO worker details.");
      }
    };

    fetchWorkers();
  }, [token]);

  const handleSendEmail = async (workerId, amount) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/epfo/generate-payment-mail`,
        { workerId, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Email sent successfully!");
    } catch (error) {
     
      toast.error("Failed to send email.");
    }
  };

  const handleDecreaseEPFO = async (workerId) => {
    const amount = epfoDecreaseAmount[workerId];
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/epfo/decrease-fees`,
        { workerId, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("EPFO decreased successfully!");

      // Fetch updated data
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/epfo/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setZeroFeesWorkers(response.data.zeroFees || []);
        setNonZeroFeesWorkers(response.data.nonZeroFees || []);
      }
    } catch (error) {
   
      toast.error("Failed to decrease EPFO.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">View EPFO Details</h2>

      {/* Workers with Zero Fees */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-green-700">Workers with Zero Fees</h3>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Worker ID</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Experience</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Categories</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {zeroFeesWorkers.map((worker) => (
                <tr key={worker.worker._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-900">{worker.worker._id}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{worker.worker.firstName} {worker.worker.lastName}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{worker.worker.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {worker.worker.additionalDetails ? worker.worker.additionalDetails.experience : "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {(worker.worker.additionalDetails?.categorys || []).map((cat) => cat.categoryName).join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Workers with Non-Zero Fees */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-red-700">Workers with Non-Zero Fees</h3>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Worker ID</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Experience</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Categories</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {nonZeroFeesWorkers.map((worker) => (
                <tr key={worker.worker._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-900">{worker.worker._id}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{worker.worker.firstName} {worker.worker.lastName}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{worker.worker.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {worker.worker.additionalDetails ? worker.worker.additionalDetails.experience : "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {(worker.worker.additionalDetails?.categorys || []).map((cat) => cat.categoryName).join(", ")}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">${worker.fees}</td>
                  <td className="py-3 px-4 text-sm">
                    <button
                      onClick={() => handleSendEmail(worker.worker._id, worker.fees)}
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600 transition-colors"
                    >
                      Send Email
                    </button>
                    <input
                      type="number"
                      className="border rounded px-2 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={epfoDecreaseAmount[worker.worker._id] || ""}
                      onChange={(e) =>
                        setEpfoDecreaseAmount({ ...epfoDecreaseAmount, [worker.worker._id]: e.target.value })
                      }
                      placeholder="Amount"
                      min="1"
                    />
                    <button
                      onClick={() => handleDecreaseEPFO(worker.worker._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded ml-2 hover:bg-red-600 transition-colors"
                    >
                      Decrease EPFO
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}