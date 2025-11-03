import React from "react";
import { MessageSquare, User, CheckCircle, Clock } from "lucide-react";

const DoubtCard = ({ doubt }) => {
  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "RESOLVED":
        return "bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200 dark:from-green-800/30 dark:to-green-900/10 dark:text-green-300 dark:border-green-700/40";
      case "PENDING":
        return "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-200 dark:from-yellow-700/20 dark:to-yellow-800/5 dark:text-yellow-300 dark:border-yellow-700/40";
      case "OPEN":
        return "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200 dark:from-blue-700/20 dark:to-blue-800/5 dark:text-blue-300 dark:border-blue-700/40";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  return (
    <div
      className="
        bg-white dark:bg-gray-900
        border border-gray-100 dark:border-gray-800
        rounded-2xl p-5 mb-6
        shadow-sm hover:shadow-xl
        transition-all duration-300 ease-in-out
        hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-500/40
      "
    >
      {/* 🔹 Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 leading-snug">
          {doubt.title}
        </h3>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${getStatusStyle(
            doubt.status
          )}`}
        >
          {doubt.status || "OPEN"}
        </span>
      </div>

      {/* 📝 Description */}
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5 border-l-4 border-blue-200 dark:border-blue-500/40 pl-3 italic">
        {doubt.description?.length > 160
          ? doubt.description.substring(0, 160) + "..."
          : doubt.description}
      </p>

      {/* 🧠 Meta Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3">
        <div className="flex items-center gap-2">
          <User size={16} className="text-blue-500 dark:text-blue-400" />
          <span>{doubt.user?.name || "Anonymous"}</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-blue-500 dark:text-blue-400" />
          <span>{doubt.replies?.length ?? 0} Replies</span>
        </div>
        <div className="flex items-center gap-2">
          {doubt.status === "RESOLVED" ? (
            <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
          ) : (
            <Clock size={16} className="text-yellow-600 dark:text-yellow-400" />
          )}
          <span>
            {new Date(doubt.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DoubtCard;
