import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-3xl text-center">
        {/* 🌟 Header */}
        <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-4">
          About Doubts Clearance System
        </h1>

        {/* 📘 Intro */}
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
          The{" "}
          <strong className="text-blue-700 dark:text-blue-400">
            Doubts Clearance System
          </strong>{" "}
          is a platform designed to simplify how students post academic queries
          and get them resolved quickly by teachers or peers.
        </p>

        {/* ⚙️ Tech Stack */}
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mt-4">
          This project uses the{" "}
          <strong className="text-blue-700 dark:text-blue-400">
            MERN Stack
          </strong>{" "}
          — MongoDB, Express.js, React, and Node.js — to create a smooth,
          responsive, and secure experience. It supports features like:
        </p>

        {/* 🧾 Features List */}
        <ul className="text-left list-disc list-inside text-gray-700 dark:text-gray-300 mt-6 space-y-2 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
          <li>Post and manage your doubts with support for image attachments.</li>
          <li>Upvote or downvote doubts to highlight the most relevant ones.</li>
          <li>Admin dashboard for managing all users and doubts.</li>
          <li>Reply approval system that updates reputation scores dynamically.</li>
        </ul>

        {/* 💡 Goal */}
        <p className="text-gray-600 dark:text-gray-400 mt-8">
          Our goal is to make learning collaborative, transparent, and accessible
          for everyone. 📚
        </p>
      </div>
    </div>
  );
};

export default About;
