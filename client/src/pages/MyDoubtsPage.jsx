// // src/pages/MyDoubtsPage.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const MyDoubtsPage = () => {
//   const [doubts, setDoubts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const token = localStorage.getItem("jwt_token");
//   const userRole = localStorage.getItem("user_role") || "USER"; // ✅ added

//   // ✅ Fetch user's doubts
//   useEffect(() => {
//     const fetchDoubts = async () => {
//       try {
//         const { data } = await axios.get("http://localhost:5000/api/doubts/my", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setDoubts(Array.isArray(data.doubts) ? data.doubts : []);
//       } catch (err) {
//         console.error("Failed to load doubts:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDoubts();
//   }, [token]);

//   // ✅ Vote handler
//   const handleVote = async (id, type) => {
//     try {
//       const { data } = await axios.post(
//         `http://localhost:5000/api/doubts/${id}/vote`,
//         { type },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setDoubts((prev) =>
//         prev.map((doubt) =>
//           doubt._id === id
//             ? {
//                 ...doubt,
//                 votes: data.votes,
//                 upvotes: data.upvotes,
//                 downvotes: data.downvotes,
//               }
//             : doubt
//         )
//       );
//     } catch (err) {
//       console.error("Vote error:", err);
//     }
//   };

//   if (loading) return <p className="text-center mt-20 text-gray-600">Loading doubts...</p>;

//   return (
//     <div className="min-h-screen flex bg-gray-50">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r p-6 shadow-sm flex flex-col">
//         {/* Logo / Header */}
//         <div className="flex items-center gap-3 mb-10">
//           <div className="h-10 w-10 flex items-center justify-center bg-blue-600 text-white rounded-xl font-bold text-xl">
//             ?
//           </div>
//           <div>
//             <h1 className="text-lg font-semibold text-gray-800">Doubts Clearance</h1>
//             <p className="text-sm text-gray-500 -mt-1">System</p>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex flex-col gap-2 text-gray-700">
//           <a
//             href="/dashboard"
//             className="flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-gray-100"
//           >
//             🏠 Dashboard
//           </a>

//           <a
//             href="/doubts/new"
//             className="flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-gray-100"
//           >
//             ✏️ Post Doubt
//           </a>

//           <a
//             href="/doubts"
//             className="flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-gray-100"
//           >
//             🔍 Search
//           </a>

//           <a
//             href="/my-doubts"
//             className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-500 text-white hover:opacity-90 transition"
//           >
//             📚 My Doubts
//           </a>

//           {/* ✅ Visible only for Admins */}
//           {userRole === "ADMIN" && (
//             <a
//               href="/admin"
//               className="flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-gray-100"
//             >
//               👨‍💻 Admin Panel
//             </a>
//           )}
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-10 text-gray-900">
//         <h2 className="text-3xl font-bold mb-8">My Doubts</h2>

//         {doubts.length === 0 ? (
//           <p className="text-gray-500">You haven’t posted any doubts yet.</p>
//         ) : (
//           <div className="space-y-6">
//             {doubts.map((doubt) => {
//               const userId = localStorage.getItem("user_id");
//               const hasUpvoted = doubt.upvotes?.includes(userId);
//               const hasDownvoted = doubt.downvotes?.includes(userId);

//               return (
//                 <div
//                   key={doubt._id}
//                   className="bg-white rounded-xl shadow p-6 flex justify-between items-start hover:shadow-md transition-all border border-gray-200"
//                 >
//                   <div className="flex-1 pr-6">
//                     <h3 className="text-xl font-semibold text-gray-900 mb-1">{doubt.title}</h3>
//                     <p className="text-gray-600 mb-3">{doubt.description}</p>

//                     <p
//                       className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
//                         doubt.status === "RESOLVED"
//                           ? "bg-green-100 text-green-700"
//                           : doubt.status === "APPROVED"
//                           ? "bg-blue-100 text-blue-700"
//                           : "bg-yellow-100 text-yellow-700"
//                       }`}
//                     >
//                       {doubt.status}
//                     </p>
//                   </div>

//                   {/* Votes Section */}
//                   <div className="flex flex-col items-center justify-center">
//                     <button
//                       onClick={() => handleVote(doubt._id, "upvote")}
//                       className={`text-2xl ${
//                         hasUpvoted ? "text-green-600" : "text-gray-500"
//                       } hover:text-green-600 transition`}
//                     >
//                       👍
//                     </button>
//                     <span className="text-xl font-bold text-gray-700 my-1">
//                       {doubt.votes || 0}
//                     </span>
//                     <button
//                       onClick={() => handleVote(doubt._id, "downvote")}
//                       className={`text-2xl ${
//                         hasDownvoted ? "text-red-600" : "text-gray-500"
//                       } hover:text-red-600 transition`}
//                     >
//                       👎
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default MyDoubtsPage;

// src/pages/MyDoubtsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const MyDoubtsPage = () => {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("jwt_token");
  const userRole = localStorage.getItem("user_role") || "USER";

  // ✅ Fetch user's doubts
  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/doubts/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoubts(Array.isArray(data.doubts) ? data.doubts : []);
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDoubts((prev) =>
        prev.map((d) =>
          d._id === id
            ? { ...d, votes: data.votes, upvotes: data.upvotes, downvotes: data.downvotes }
            : d
        )
      );
    } catch (err) {
      console.error("Vote error:", err);
    }
  };

  // ✅ Approve / Unapprove reply instantly (no refresh needed)
const handleApprove = async (doubtId, replyId) => {
  try {
    const { data } = await axios.patch(
      `http://localhost:5000/api/doubts/${doubtId}/replies/${replyId}/approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setDoubts((prevDoubts) =>
      prevDoubts.map((d) => {
        if (d._id !== doubtId) return d;

        // ✅ Toggle the 'approved' state for the clicked reply
        const updatedReplies = d.replies.map((r) =>
          r._id === replyId ? { ...r, approved: !r.approved } : r
        );

        // ✅ Determine if any reply is still approved → RESOLVED
        const anyApproved = updatedReplies.some((r) => r.approved);

        return {
          ...d,
          replies: updatedReplies,
          status: anyApproved ? "RESOLVED" : "PENDING",
        };
      })
    );
  } catch (err) {
    console.error("Approve toggle error:", err);
    alert("Failed to approve/unapprove reply");
  }
};

  if (loading) return <p className="text-center mt-20 text-gray-600">Loading doubts...</p>;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 shadow-sm flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-10 w-10 flex items-center justify-center bg-blue-600 text-white rounded-xl font-bold text-xl">
            ?
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">Doubts Clearance</h1>
            <p className="text-sm text-gray-500 -mt-1">System</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2 text-gray-700">
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">🏠 Dashboard</a>
          <a href="/doubts/new" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">✏️ Post Doubt</a>
          <a href="/doubts" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">🔍 Search</a>
          <a href="/my-doubts" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-500 text-white hover:opacity-90">📚 My Doubts</a>
          {userRole === "ADMIN" && (
            <a href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">👨‍💻 Admin Panel</a>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 text-gray-900">
        <h2 className="text-3xl font-bold mb-8">My Doubts</h2>

        {doubts.length === 0 ? (
          <p className="text-gray-500">You haven’t posted any doubts yet.</p>
        ) : (
          <div className="space-y-8">
            {doubts.map((doubt) => (
              <div key={doubt._id} className="bg-white rounded-xl shadow p-6 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{doubt.title}</h3>
                    <p className="text-gray-600 mb-2">{doubt.description}</p>
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

                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleVote(doubt._id, "upvote")}
                      className="text-2xl text-gray-500 hover:text-green-600 transition"
                    >
                      👍
                    </button>
                    <span className="text-lg font-bold text-gray-700">{doubt.votes || 0}</span>
                    <button
                      onClick={() => handleVote(doubt._id, "downvote")}
                      className="text-2xl text-gray-500 hover:text-red-600 transition"
                    >
                      👎
                    </button>
                  </div>
                </div>

                {/* 🧵 Replies Section */}
                {doubt.replies?.length > 0 && (
                  <div className="mt-5 border-t pt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Replies:</h4>
                    <div className="space-y-3">
                      {doubt.replies.map((reply) => (
                        <div
                          key={reply._id}
                          className={`flex justify-between items-center p-3 rounded-lg border ${
                            reply.approved ? "bg-green-50 border-green-300" : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div>
                            <p className="text-gray-800">{reply.message}</p>
                            <small className="text-gray-500">
                              — {reply.user?.name || "Anonymous"}
                            </small>
                          </div>

                          {/* ✅ Approve / Unapprove button (only for doubt owner) */}
                          {doubt.user && String(doubt.user._id) === String(localStorage.getItem("user_id")) ? (
                            <button
                              onClick={() => handleApprove(doubt._id, reply._id)}
                              className={`px-3 py-1 text-sm rounded transition ${
                                reply.approved
                                  ? "bg-red-500 text-white hover:bg-red-600"
                                  : "bg-green-500 text-white hover:bg-green-600"
                              }`}
                            >
                              {reply.approved ? "Unapprove" : "Approve"}
                            </button>
                          ) : reply.approved ? (
                            <span className="text-green-600 font-medium">✔ Approved</span>
                          ) : null}

                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyDoubtsPage;
