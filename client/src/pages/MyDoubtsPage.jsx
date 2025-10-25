// src/pages/MyDoubtsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const MyDoubtsPage = () => {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("jwt_token");

  // ✅ Fetch user's doubts on mount
  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/doubts/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoubts(data);
      } catch (err) {
        console.error("Failed to load doubts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoubts();
  }, [token]);

  // ✅ Vote handler
  const handleVote = async (id, type) => {
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/doubts/${id}/vote`,
        { type },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update UI
      setDoubts((prev) =>
        prev.map((doubt) =>
          doubt._id === id
            ? {
                ...doubt,
                votes: data.votes,
                upvotes: data.upvotes,
                downvotes: data.downvotes,
              }
            : doubt
        )
      );
    } catch (err) {
      console.error("Vote error:", err);
    }
  };

  if (loading) return <p className="text-center mt-20">Loading doubts...</p>;

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
            <p className="text-sm text-gray-500 -mt-1">System</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2 text-gray-700">
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">
            🏠 Dashboard
          </a>
          <a href="/doubts/new" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">
            ✏️ Post Doubt
          </a>
          <a href="/doubts" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">
            🔍 Search
          </a>
          <a href="/my-doubts" className="flex items-center gap-3 bg-blue-100 text-blue-700 font-medium px-3 py-2 rounded-lg">
            📚 My Doubts
          </a>
          <a href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">
            👨‍💻 Moderator/Admin
          </a>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10">
        <h2 className="text-3xl font-bold mb-8">My Doubts</h2>

        <div className="space-y-6">
          {doubts.map((doubt) => {
            const userId = localStorage.getItem("user_id"); // optional if you store this after login
            const hasUpvoted = doubt.upvotes?.includes(userId);
            const hasDownvoted = doubt.downvotes?.includes(userId);

            return (
              <div
                key={doubt._id}
                className="bg-white rounded-xl shadow p-6 flex justify-between items-start hover:shadow-md transition-all"
              >
                <div className="flex-1 pr-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{doubt.title}</h3>
                  <p className="text-gray-600 mb-3">{doubt.description}</p>

                  <p
                    className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
                      doubt.status === "RESOLVED"
                        ? "bg-green-100 text-green-700"
                        : doubt.status === "APPROVED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {doubt.status}
                  </p>
                </div>

                {/* Votes Section */}
                <div className="flex flex-col items-center justify-center">
                  <button
                    onClick={() => handleVote(doubt._id, "upvote")}
                    className={`text-2xl ${
                      hasUpvoted ? "text-green-600" : "text-gray-500"
                    } hover:text-green-600 transition`}
                  >
                    👍
                  </button>
                  <span className="text-xl font-bold text-gray-700 my-1">
                    {doubt.votes || 0}
                  </span>
                  <button
                    onClick={() => handleVote(doubt._id, "downvote")}
                    className={`text-2xl ${
                      hasDownvoted ? "text-red-600" : "text-gray-500"
                    } hover:text-red-600 transition`}
                  >
                    👎
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default MyDoubtsPage;
