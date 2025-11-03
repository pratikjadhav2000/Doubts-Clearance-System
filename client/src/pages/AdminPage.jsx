import React, { useEffect, useState } from "react";
import axios from "axios";

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
    const { data } = await axios.get("http://localhost:5000/api/admin/doubts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Admin doubts:", data);
    setDoubts(data.doubts || []); // ✅ fixed structure
  } catch (error) {
    console.error("Error fetching doubts:", error);
  }
  };


  const fetchUsers = async () => {
  try {
    const { data } = await axios.get("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Admin users:", data);
    setUsers(data.users || []); // <-- fixed
  } catch (error) {
    console.error("Error fetching users:", error);
  }
  };

  /* -------------------------------
      🧠 DOUBT ACTIONS
  --------------------------------*/
  const handleApprove = async (doubtId, replyId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/doubts/${doubtId}`,
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
      await axios.put(
        `http://localhost:5000/api/admin/doubts/${doubtId}`,
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
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}`,
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
        <div className="space-y-4">
          {doubts.length === 0 ? (
            <p className="text-gray-500">No doubts found.</p>
          ) : (
            doubts.map((doubt) => (
              <div
                key={doubt._id}
                className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-all border"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-6">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {doubt.title}
                    </h3>
                    <p className="text-gray-600">{doubt.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Asked by: <span className="font-medium">{doubt.user?.name || "Anonymous"}</span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleDelete(doubt._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                    >
                      🗑️ Delete
                    </button>

                    {doubt.replies?.length > 0 && (
                      <button
                        onClick={() => handleApprove(doubt._id, doubt.replies[0]._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                      >
                        ✅ Approve
                      </button>
                    )}
                  </div>
                </div>

                {/* 🖼️ Show attachments if any */}
                {doubt.attachments?.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {doubt.attachments.map((img, idx) => (
                      <img
                        key={idx}
                        src={`http://localhost:5000${img}`}
                        alt="Attachment"
                        className="h-32 w-full object-cover rounded-md border hover:scale-105 transition-transform"
                      />
                    ))}
                  </div>
                )}

                {/* 💬 Replies */}
                {doubt.replies?.length > 0 && (
                  <div className="mt-4 border-t pt-3">
                    <h4 className="font-semibold mb-2">Replies:</h4>
                    {doubt.replies.map((reply, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg mb-2 border ${
                          reply.approved ? "bg-green-50 border-green-400" : "bg-gray-50"
                        }`}
                      >
                        <p className="text-sm">
                          <b>{reply.user?.name || "Anonymous"}:</b> {reply.message}
                        </p>
                        {reply.image && (
                          <img
                            src={`http://localhost:5000${reply.image}`}
                            alt="Reply"
                            className="mt-2 h-24 w-24 object-cover rounded-md border"
                          />
                        )}
                      </div>
                    ))}
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
