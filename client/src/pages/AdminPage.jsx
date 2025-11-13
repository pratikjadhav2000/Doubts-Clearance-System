import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../utils/api";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("doubts");
  const [doubts, setDoubts] = useState([]);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("jwt_token");

  // Fetch Data
  useEffect(() => {
    fetchDoubts();
    fetchUsers();
  }, []);

  const fetchDoubts = async () => {
    try {
      const { data } = await api.get("/admin/doubts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Admin doubts:", data);
      setDoubts(data.doubts || []);
    } catch (error) {
      console.error("Error fetching doubts:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Admin users:", data);
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  /* -------------------------------
      🧠 DOUBT ACTIONS
  --------------------------------*/
  const handleApprove = async (doubtId, replyId) => {
    try {
      await api.put(`/admin/doubts/${doubtId}`,
        { action: "approve", replyId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Doubt approved successfully!");
      fetchDoubts();
    } catch (error) {
      console.error("Approve error:", error);
      alert("❌ Failed to approve doubt");
    }
  };

  const handleDelete = async (doubtId) => {
    if (!window.confirm("🗑️ Are you sure you want to delete this doubt?")) return;
    try {
      await api.put(`/admin/doubts/${doubtId}`,
        { action: "delete" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("🗑️ Doubt deleted successfully!");
      setDoubts((prev) => prev.filter((d) => d._id !== doubtId));
    } catch (error) {
      console.error("Delete error:", error);
      alert("❌ Failed to delete doubt");
    }
  };

  /* -------------------------------
      👥 USER ACTIONS
  --------------------------------*/
  const handleToggleUser = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ User status updated!");
      fetchUsers();
    } catch (error) {
      console.error("Toggle user error:", error);
      alert("❌ Failed to update user");
    }
  };

  /* -------------------------------
      🎨 RENDER
  --------------------------------*/
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Admin Dashboard</h1>

      {/* 🔀 Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("doubts")}
          className={`px-6 py-2 rounded-md ${
            activeTab === "doubts" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Manage Doubts
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-2 rounded-md ${
            activeTab === "users" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Manage Users
        </button>
      </div>

      {/* 🧠 Doubts Section */}
      {activeTab === "doubts" && (
        <div className="space-y-6">
          {doubts.length === 0 ? (
            <p className="text-gray-500">No doubts found.</p>
          ) : (
            doubts.map((doubt) => (
              <div
                key={doubt._id}
                className="bg-white rounded-xl shadow p-6 border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {doubt.title}
                    </h3>
                    <p className="text-gray-600 mb-2">{doubt.description}</p>
                    <p className="text-sm text-gray-500 mb-3">
                      Asked by:{" "}
                      <span className="font-medium">
                        {doubt.user?.name || "Anonymous"}
                      </span>
                    </p>

                    {/* 🖼️ Doubt Attachments */}
                    {doubt.attachments && doubt.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-3">
                        {doubt.attachments.map((file, idx) =>
                          file.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                            <img
                              key={idx}
                              src={`${import.meta.env.VITE_API_URL}${file}`}
                              alt="Doubt Attachment"
                              className="w-28 h-28 object-cover rounded-lg border hover:scale-105 transition-transform"
                            />
                          ) : (
                            <a
                              key={idx}
                              href={`${import.meta.env.VITE_API_URL}${file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline text-sm"
                            >
                              📎 View File
                            </a>
                          )
                        )}
                      </div>
                    )}

                    <p
                      className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
                        doubt.status === "RESOLVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {doubt.status}
                    </p>
                  </div>

                  {/* 🔘 Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleDelete(doubt._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                {/* 💬 Replies Section */}
                {doubt.replies?.length > 0 && (
                  <div className="mt-5 border-t pt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Replies:</h4>
                    <div className="space-y-3">
                      {doubt.replies.map((reply, idx) => (
                        <div
                          key={idx}
                          className={`flex justify-between items-center p-3 rounded-lg border ${
                            reply.approved
                              ? "bg-green-50 border-green-300"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          {/* 🗨️ Message + Attachment */}
                          <div className="flex flex-col">
                            <p className="text-gray-800">{reply.message}</p>
                            <small className="text-gray-500">
                              — {reply.user?.name || "Anonymous"}
                            </small>

                            {/* 🖼️ Reply Image Preview */}
                            {reply.image && (
                              reply.image.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                <img
                                  src={`${import.meta.env.VITE_API_URL}${reply.image}`}
                                  alt="Reply Attachment"
                                  className="max-w-xs max-h-48 rounded-md mt-2 border"
                                />
                              ) : (
                                <a
                                  href={`${import.meta.env.VITE_API_URL}${reply.image}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline text-sm mt-2 inline-block"
                                >
                                  📎 View Attachment
                                </a>
                              )
                            )}
                          </div>

                          {/* ✅ Status Tag */}
                          {reply.approved ? (
                            <span className="text-green-600 font-medium">
                              ✔ Approved
                            </span>
                          ) : (
                            <span className="text-gray-500 italic">Pending</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 👥 Users Section */}
      {activeTab === "users" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="bg-white p-5 rounded-lg shadow flex justify-between items-center border"
              >
                <div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                  <p
                    className={`text-sm mt-1 ${
                      user.isSuspended ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {user.isSuspended ? "Suspended" : "Active"}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleUser(user._id)}
                  className={`px-4 py-2 rounded-md ${
                    user.isSuspended
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-yellow-500 hover:bg-yellow-600 text-white"
                  }`}
                >
                  {user.isSuspended ? "Activate" : "Suspend"}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
