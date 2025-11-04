import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [reputation, setReputation] = useState(0);
  const token = localStorage.getItem("jwt_token");

  /* 🌗 Dark Mode Sync */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* ⭐ Fetch reputation dynamically */
  const fetchReputation = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReputation(data?.user?.reputation || 0);
    } catch (err) {
      console.error("Failed to fetch user reputation:", err);
    }
  };

  useEffect(() => {
    if (token) fetchReputation();
  }, [token]);

  // 🔄 Listen for global reputation updates
  useEffect(() => {
    const handleUpdate = () => fetchReputation();
    window.addEventListener("updateReputation", handleUpdate);
    return () => window.removeEventListener("updateReputation", handleUpdate);
  }, []);

  /* 🚪 Logout */
  const logout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_id");
    window.location.href = "/login"; // full reload for safety
  };

  return (
    <nav
      className={`sticky top-0 z-30 w-full flex justify-between items-center px-6 py-3 shadow-md border-b transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-700"
          : "bg-gradient-to-r from-blue-100 via-white to-blue-100 border-blue-100"
      }`}
    >
      {/* 🔹 Brand */}
      <div
        onClick={() => navigate("/dashboard")}
        className={`text-lg font-bold tracking-wide cursor-pointer ${
          darkMode
            ? "bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
            : "bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent"
        }`}
      >
        DCS
      </div>

      {/* 🔹 Right Controls */}
      <div className="flex items-center gap-4">
        {/* ⭐ Dynamic Reputation */}
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold transition ${
            darkMode
              ? "bg-gray-800 text-yellow-400 border border-gray-700"
              : "bg-blue-100 text-blue-700 border border-blue-200"
          }`}
        >
          ⭐ {reputation}
        </div>

        {/* 🌗 Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full transition ${
            darkMode ? "hover:bg-gray-700" : "hover:bg-blue-100"
          }`}
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-blue-600" />
          )}
        </button>

        {/* 🚪 Logout */}
        <button
          onClick={logout}
          className={`ml-3 px-4 py-1.5 rounded-md text-sm font-medium transition ${
            darkMode
              ? "bg-gray-900 text-gray-200 border border-gray-600 hover:bg-gray-800"
              : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
          }`}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
