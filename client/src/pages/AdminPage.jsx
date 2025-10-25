// src/pages/AdminPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("jwt_token");

  // ✅ Fetch users and doubts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, doubtsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/doubts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUsers(usersRes.data);
        setDoubts(doubtsRes.data);
      } catch (err) {
        console.error("Error loading admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // ✅ Toggle user status
  const handleToggleUser = async (userId, currentStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}`,
        { status: currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? { ...u, status: currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }
            : u
        )
      );
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  // ✅ Approve or delete doubts
  const handleDoubtAction = async (id, action) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/doubts/${id}`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDoubts((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error("Failed to update doubt:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading admin data...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Admin Dashboard
      </h1>

      {/* Users Table */}
      <section className="mb-12 bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Manage Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        u.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleToggleUser(u._id, u.status)}
                      className={`px-4 py-1 rounded-md text-white ${
                        u.status === "ACTIVE" ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Doubts Table */}
      <section className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Manage Doubts</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Posted By</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {doubts.map((d) => (
                <tr key={d._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{d.title}</td>
                  <td className="p-3">{d.user?.name}</td>
                  <td className="p-3">{d.status}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleDoubtAction(d._id, "approve")}
                      className="bg-green-500 text-white px-3 py-1 rounded-md"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDoubtAction(d._id, "delete")}
                      className="bg-red-500 text-white px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
