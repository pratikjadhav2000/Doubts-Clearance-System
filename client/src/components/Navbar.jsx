import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, Bell } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [points, setPoints] = useState(0);
  const dropdownRef = useRef(null);

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

  /* 🔔 Mock Notifications */
  useEffect(() => {
    setNotifications([
      { id: 1, text: "Your doubt was answered ✅" },
      { id: 2, text: "Admin approved your reply 💬" },
      { id: 3, text: "Leaderboard updated 🏆" },
    ]);
  }, []);

  /* 💎 Mock Points */
  useEffect(() => {
    const storedPoints = localStorage.getItem("user_points") || 120;
    setPoints(Number(storedPoints));
  }, []);

  /* 🧠 Close dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_role");
    navigate("/", { replace: true });
  };

  return (
    <nav
      className={`
        sticky top-0 z-30 w-full
        ${darkMode
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700"
          : "bg-gradient-to-r from-blue-100 via-white to-blue-100 border-b border-blue-100"}
        flex justify-between items-center px-6 py-3 shadow-md transition-colors duration-500
      `}
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
        {/* 💎 Points */}
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
            darkMode
              ? "bg-gray-800 text-cyan-300 border border-gray-700"
              : "bg-blue-100 text-blue-700 border border-blue-200"
          }`}
        >
          ⭐ {points}
        </div>

        {/* 🔔 Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-full transition-all ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-blue-100"
            }`}
          >
            <Bell className={`h-5 w-5 ${darkMode ? "text-gray-200" : "text-gray-700"}`} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* 🔽 Dropdown */}
          <div
            className={`absolute right-0 mt-2 w-64 shadow-lg rounded-lg overflow-hidden transform transition-all duration-200 origin-top-right ${
              showNotifications
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            } ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}
          >
            <div
              className={`px-4 py-2 font-semibold ${
                darkMode ? "text-gray-100 border-b border-gray-700" : "text-gray-700 border-b border-gray-100"
              }`}
            >
              Notifications
            </div>
            {notifications.length === 0 ? (
              <p className={`text-sm p-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                No new notifications
              </p>
            ) : (
              <ul className="max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`px-4 py-2 text-sm transition ${
                      darkMode
                        ? "text-gray-200 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    {n.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
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
