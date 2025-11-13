import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../utils/api";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
  });
  const [recent, setRecent] = useState([]);
  const token = localStorage.getItem("jwt_token");

  // ✅ Fetch user info & dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get user info
        const userRes = await api.get("/auth/me", {
  headers: { Authorization: `Bearer ${token}` },
});
console.log("User API response:", userRes.data); // 🧩 add this

        // const userRes = await api.get("/auth/me", {
        //   headers: { Authorization: `Bearer ${token}` },
        // });

        const userData = userRes.data.user || userRes.data;
        setUser(userData);

        // ✅ Store role locally (for global use)
        if (userData.role) {
          localStorage.setItem("user_role", userData.role);
        }

        // Get dashboard stats
        const res = await api.get("/doubts/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Safe defaults
        setStats(res.data.stats || { total: 0, resolved: 0, pending: 0 });
        setRecent(res.data.recent || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };

    if (token) fetchDashboardData();
  }, [token]);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_role");
    window.location.href = "/login";
  };

  if (!user)
    return (
      <p className="text-center text-gray-500 mt-10">Loading dashboard...</p>
    );

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 shadow-sm flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-10 w-10 flex items-center justify-center bg-blue-600 text-white rounded-xl font-bold text-xl">
            ?
          </div>
          <div>
            <h1 className="text-lg font-semibold">Doubts Clearance</h1>
            <p className="text-lg font-semibold -mt-1">System</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2 text-gray-700">
          <a
            href="/dashboard"
            className="flex items-center gap-3 bg-blue-100 text-blue-700 font-medium px-3 py-2 rounded-lg"
          >
            🏠 Dashboard
          </a>
          <a
            href="/doubts/new"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            ✏️ Post Doubt
          </a>
          <a
            href="/doubts"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            🔍 Search
          </a>
          <a
            href="/my-doubts"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            📚 My Doubts
          </a>

          {/* ✅ Admin-only sidebar item */}
          {isAdmin && (
            <a
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              👨‍💻 Admin Panel
            </a>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 relative">
        {/* ✅ Logout button (optional) */}
        <div className="absolute top-6 right-6">
          {/* Uncomment if you want to show logout
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button> */}
        </div>

        {/* Dashboard Header */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome back,{" "}
          <span className="text-blue-600">{user.name}</span> 👋
        </h2>

        {/* Stats section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-100 p-6 rounded-xl shadow-sm text-center">
            <h3 className="text-4xl font-bold text-blue-700">{stats.total}</h3>
            <p className="text-gray-600 font-medium mt-2">Total Doubts</p>
          </div>

          <div className="bg-green-100 p-6 rounded-xl shadow-sm text-center">
            <h3 className="text-4xl font-bold text-green-700">
              {stats.resolved}
            </h3>
            <p className="text-gray-600 font-medium mt-2">Resolved Doubts</p>
          </div>

          <div className="bg-yellow-100 p-6 rounded-xl shadow-sm text-center">
            <h3 className="text-4xl font-bold text-yellow-700">
              {stats.pending}
            </h3>
            <p className="text-gray-600 font-medium mt-2">Pending Doubts</p>
          </div>
        </div>

        {/* Recent doubts */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Recent Doubts
          </h3>

          {recent.length === 0 ? (
            <p className="text-gray-500">No recent doubts found.</p>
          ) : (
            <table className="min-w-full text-left border-t border-gray-200">
              <thead>
                <tr className="text-gray-700 border-b">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Votes</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((doubt) => (
                  <tr key={doubt._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{doubt.title}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          doubt.status === "RESOLVED"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {doubt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-700">
                      {doubt.totalvotes || 0}
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(doubt.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
