import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function PastServices() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [canceledTasks, setCanceledTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/task/all`,{
          headers: { Authorization: `Bearer ${token}` },
        }); // Fetch tasks from the backend
        setCompletedTasks(response.data.completedTasks);
        setCanceledTasks(response.data.canceledTasks);
      } catch (error) {
        setError("Failed to fetch tasks. Please try again later.");
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">History of Services</h2>

      {/* Completed Tasks */}
      <h3 className="text-xl font-semibold mb-4">Completed Tasks</h3>
      <table className="min-w-full bg-white border border-gray-300 mb-8">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Task ID</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Client</th>
            <th className="py-2 px-4 border-b">Worker</th>
            <th className="py-2 px-4 border-b">Completed At</th>
          </tr>
        </thead>
        <tbody>
          {completedTasks.map((task) => (
            <tr key={task._id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{task._id}</td>
              <td className="py-2 px-4 border-b">{task.category?.categoryName}</td>
              <td className="py-2 px-4 border-b">₹{task.category?.price}</td>
              <td className="py-2 px-4 border-b">
                {task.client?.firstName} {task.client?.lastName}
              </td>
              <td className="py-2 px-4 border-b">
                {task.worker?.firstName} {task.worker?.lastName}
              </td>
              <td className="py-2 px-4 border-b">
                {new Date(task.completedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Canceled Tasks */}
      <h3 className="text-xl font-semibold mb-4">Canceled Tasks</h3>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Task ID</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Client</th>
            <th className="py-2 px-4 border-b">Worker</th>
            <th className="py-2 px-4 border-b">Canceled At</th>
          </tr>
        </thead>
        <tbody>
          {canceledTasks.map((task) => (
            <tr key={task._id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{task._id}</td>
              <td className="py-2 px-4 border-b">{task.category?.categoryName}</td>
              <td className="py-2 px-4 border-b">₹{task.category?.price}</td>
              <td className="py-2 px-4 border-b">
                {task.client?.firstName} {task.client?.lastName}
              </td>
              <td className="py-2 px-4 border-b">
                {task.worker?.firstName} {task.worker?.lastName}
              </td>
              <td className="py-2 px-4 border-b">
                {new Date(task.completedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}