import React, { useState } from "react";
import axios from "axios";

const AskDoubtPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duplicates, setDuplicates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("jwt_token");

  // ✅ Handle doubt submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1️⃣ Check for duplicate doubts before posting
      const res = await axios.post(
        "http://localhost:5000/api/doubts/check-duplicate",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // If similar doubts exist → show modal first
      if (res.data.similar && res.data.similar.length > 0) {
        setDuplicates(res.data.similar);
        setShowModal(true);
      } else {
        await postDoubt();
      }
    } catch (err) {
      console.error("Error checking duplicates:", err);
      await postDoubt();
    } finally {
      setLoading(false);
    }
  };

  // ✅ Actually post the doubt to backend
  const postDoubt = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/doubts",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Doubt posted successfully!");
      setTitle("");
      setDescription("");
      setDuplicates([]);
      setShowModal(false);
    } catch (err) {
      console.error("Error posting doubt:", err);
      alert("❌ Error posting doubt. Try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10 border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">
        Ask a Doubt
      </h1>

      {/* 🧾 Doubt Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Title of your doubt
          </label>
          <input
            type="text"
            placeholder="Enter a short title for your doubt..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            placeholder="Explain your doubt clearly..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
            className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-md transition ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Checking for similar doubts..." : "Submit Doubt"}
        </button>
      </form>

      {/* 🔁 Duplicate Doubt Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-96 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-red-600 mb-3">
              Similar Doubts Found!
            </h2>
            <p className="text-gray-600 mb-3 text-sm">
              These doubts look similar to yours. Please review them before posting a new one.
            </p>

            <ul className="max-h-40 overflow-y-auto mb-4 list-disc pl-5 space-y-1">
              {duplicates.map((dup) => (
                <li key={dup._id}>
                  <a
                    href={`/doubts/${dup._id}`}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {dup.title}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={postDoubt}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Post Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AskDoubtPage;
