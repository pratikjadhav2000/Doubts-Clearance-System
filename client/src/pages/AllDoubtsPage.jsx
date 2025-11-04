import React, { useEffect, useState } from "react";
import axios from "axios";

const AllDoubtsPage = () => {
  const [doubts, setDoubts] = useState([]);
  const [filteredDoubts, setFilteredDoubts] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState("");
  const token = localStorage.getItem("jwt_token");

  // ✅ Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(res.data.role || res.data.user?.role || "USER");
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setUserRole("USER");
      }
    };
    fetchUserRole();
  }, [token]);

  // ✅ Fetch all doubts
  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/doubts/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedDoubts = res.data.doubts || [];
        setDoubts(fetchedDoubts);
        setFilteredDoubts(fetchedDoubts);
      } catch (error) {
        console.error("Error fetching doubts:", error);
      }
    };
    fetchDoubts();
  }, [token]);

  // ✅ Search filter
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

  // ✅ Handle voting
  const handleVote = async (id, type) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/doubts/${id}/vote`,
        { type },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Data is : ",res); 
      setDoubts((prev) =>
        prev.map((d) => (d._id === id ? { ...d, totalvotes: res.data.votes } : d))
      );
      
    } catch (error) {
      console.error("Vote error:", error);
      alert(error.response?.data?.message || "Error while voting");
    }
  };

  // ✅ Handle reply submission with image
  const handleReply = async (id) => {
    const reply = replyText[id];
    if (!reply || !reply.message?.trim())
      return alert("Reply cannot be empty");

    try {
      const formData = new FormData();
      formData.append("message", reply.message);
      if (reply.file) formData.append("attachment", reply.file);

      const res = await axios.post(
        `http://localhost:5000/api/doubts/${id}/reply`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedReplies = res.data.replies || [];
      setDoubts((prev) =>
        prev.map((d) => (d._id === id ? { ...d, replies: updatedReplies } : d))
      );
      setReplyText((prev) => ({ ...prev, [id]: {} }));
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
          <a
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
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
            className="flex items-center gap-3 bg-blue-100 text-blue-700 font-medium px-3 py-2 rounded-lg"
          >
            🔍 All Doubts
          </a>
          <a
            href="/my-doubts"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            📚 My Doubts
          </a>

          {/* ✅ Admin Panel visible only for admins */}
          {userRole === "ADMIN" && (
            <a
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              👨‍💻 Admin Panel
            </a>
          )}
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

        {/* ✅ Doubt List */}
        <div className="space-y-6">
          {filteredDoubts.length === 0 && (
            <p className="text-gray-500">No doubts found.</p>
          )}

          {filteredDoubts.map((doubt) => (
            <div
              key={doubt._id}
              className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {doubt.title}
              </h3>
              <p className="text-gray-600 mb-3">{doubt.description}</p>

              {doubt.attachments && doubt.attachments.length > 0 && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {doubt.attachments.map((img, idx) => (
                    <img
                      key={idx}
                      src={`http://localhost:5000${img}`}
                      alt="attachment"
                      className="h-32 w-full object-cover rounded-md border"
                    />
                  ))}
                </div>
              )}

              {/* 🖼️ Show attached images */}
              {doubt.attachments && doubt.attachments.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {doubt.attachments.map((img, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5000${img}`}
                      alt="Doubt Attachment"
                      className="w-28 h-28 object-cover rounded-lg border hover:scale-105 transition-transform"
                    />
                  ))}
                </div>
              )}

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
                  <span className="font-bold">{doubt.totalvotes || 0}</span>
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
                        <div className="text-sm">
                          <b>{r.user?.name || "Anonymous"}:</b> {r.message}
                          {r.image && (
                            <img
                              src={`http://localhost:5000${r.image}`}
                              alt="Reply Attachment"
                              className="w-32 h-32 object-cover rounded-md mt-2 border"
                            />
                          )}
                        </div>
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
                    value={replyText[doubt._id]?.message || ""}
                    onChange={(e) =>
                      setReplyText((prev) => ({
                        ...prev,
                        [doubt._id]: {
                          ...prev[doubt._id],
                          message: e.target.value,
                        },
                      }))
                    }
                    placeholder="Write your reply..."
                    className="border rounded-lg p-2 w-full focus:ring focus:ring-blue-200"
                    rows="2"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setReplyText((prev) => ({
                        ...prev,
                        [doubt._id]: {
                          ...prev[doubt._id],
                          file: e.target.files[0],
                        },
                      }))
                    }
                    className="border p-2 rounded-lg text-sm text-gray-600"
                  />

                  {/* ✅ Preview selected reply image */}
                  {replyText[doubt._id]?.file && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(replyText[doubt._id].file)}
                        alt="Reply Preview"
                        className="w-32 h-32 object-cover rounded-md border shadow-sm"
                      />
                    </div>
                  )}

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
