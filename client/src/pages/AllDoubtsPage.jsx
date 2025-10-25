import React, { useEffect, useState } from "react";
import axios from "axios";

const AllDoubtsPage = () => {
  const [doubts, setDoubts] = useState([]);
  const [filteredDoubts, setFilteredDoubts] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("jwt_token");

  // ✅ Fetch all doubts
  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/doubts/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoubts(res.data);
        setFilteredDoubts(res.data);
      } catch (error) {
        console.error("Error fetching doubts:", error);
      }
    };
    fetchDoubts();
  }, [token]);

  // ✅ Search filtering logic
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = doubts.filter(
      (d) =>
        d.title.toLowerCase().includes(term) ||
        d.description.toLowerCase().includes(term) ||
        (d.tags && d.tags.some((t) => t.toLowerCase().includes(term)))
    );
    setFilteredDoubts(filtered);
  }, [searchTerm, doubts]);

  // ✅ Handle voting (Upvote / Downvote)
  const handleVote = async (id, type) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/doubts/${id}/vote`,
        { type },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDoubts((prev) =>
        prev.map((d) => (d._id === id ? { ...d, votes: res.data.votes } : d))
      );
    } catch (error) {
      console.error("Vote error:", error);
      alert(error.response?.data?.message || "Error while voting");
    }
  };

  // ✅ Handle reply submission
  const handleReply = async (id) => {
    const message = replyText[id];
    if (!message || !message.trim()) return alert("Reply cannot be empty");

    try {
      const res = await axios.post(
        `http://localhost:5000/api/doubts/${id}/reply`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update replies in UI instantly
      setDoubts((prev) =>
        prev.map((d) => (d._id === id ? { ...d, replies: res.data } : d))
      );
      setReplyText((prev) => ({ ...prev, [id]: "" }));
    } catch (error) {
      console.error("Reply error:", error);
      alert(error.response?.data?.message || "Failed to post reply");
    }
  };

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
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">🏠 Dashboard</a>
          <a href="/doubts/new" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">✏️ Post Doubt</a>
          <a href="/doubts" className="flex items-center gap-3 bg-blue-100 text-blue-700 font-medium px-3 py-2 rounded-lg">🔍 All Doubts</a>
          <a href="/my-doubts" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">📚 My Doubts</a>
          <a href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">👨‍💻 Admin</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h2 className="text-3xl font-bold mb-6">All Doubts</h2>

        {/* ✅ Search bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="🔍 Search doubts by title, tag, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="space-y-6">
          {filteredDoubts.length === 0 && (
            <p className="text-gray-500">No doubts found.</p>
          )}

          {filteredDoubts.map((doubt) => (
            <div key={doubt._id} className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-all">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{doubt.title}</h3>
              <p className="text-gray-600 mb-3">{doubt.description}</p>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Asked by: {doubt.user?.name || "Anonymous"}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleVote(doubt._id, "upvote")}
                    className="text-2xl text-gray-500 hover:text-green-600 transition"
                  >
                    👍
                  </button>
                  <span className="font-bold">{doubt.votes}</span>
                  <button
                    onClick={() => handleVote(doubt._id, "downvote")}
                    className="text-2xl text-gray-500 hover:text-red-600 transition"
                  >
                    👎
                  </button>
                </div>
              </div>

              {/* Replies */}
              <div className="mt-6 border-t pt-4">
                <h4 className="text-lg font-semibold mb-2">Replies</h4>

                {doubt.replies && doubt.replies.length > 0 ? (
                  <div className="space-y-2 mb-3">
                    {doubt.replies.map((r, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 p-3 rounded-lg border border-gray-100"
                      >
                        <p className="text-sm">
                          <b>{r.user?.name || "Anonymous"}:</b> {r.message}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(r.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No replies yet.</p>
                )}

                {/* Reply input */}
                <div className="mt-3 flex flex-col gap-2">
                  <textarea
                    value={replyText[doubt._id] || ""}
                    onChange={(e) =>
                      setReplyText((prev) => ({
                        ...prev,
                        [doubt._id]: e.target.value,
                      }))
                    }
                    placeholder="Write your reply..."
                    className="border rounded-lg p-2 w-full focus:ring focus:ring-blue-200"
                    rows="2"
                  />
                  <button
                    onClick={() => handleReply(doubt._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg w-fit hover:bg-blue-700 transition"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllDoubtsPage;
