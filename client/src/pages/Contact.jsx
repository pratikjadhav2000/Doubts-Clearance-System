import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-6 py-12 flex flex-col items-center">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-6 text-center">
          📞 Contact Our Admin Team
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-400 mb-10">
          Need help or have a query? Our{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            Doubts Clearance System
          </span>{" "}
          team is here to assist you.  
          Choose the right admin based on your issue.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* 🧠 Technical Support */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all">
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              🧠 Technical Support
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Facing issues with login, registration, or system errors?  
              Contact our technical admin for assistance.
            </p>
            <p className="font-medium text-gray-700 dark:text-gray-300">
              Email:{" "}
              <a
                href="kevalsinh_m250833cs@nitc.ac.in"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                kevalsinh_m250833cs@nitc.ac.in
              </a>
            </p>
          </div>

          {/* 🧾 Account & Access Issues */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all">
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              🧾 Account & Access Issues
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Trouble accessing your profile or forgot credentials?  
              Reach out to our account admin.
            </p>
            <p className="font-medium text-gray-700 dark:text-gray-300">
              Email:{" "}
              <a
                href="mailto:accounts@dcsystem.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                pratik_m250461cs@nitc.ac.in
              </a>
            </p>
          </div>

          {/* 💬 Feedback & Suggestions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all">
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              💬 Feedback & Suggestions
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Have ideas to improve the platform or new feature requests?  
              Share them with our feedback admin.
            </p>
            <p className="font-medium text-gray-700 dark:text-gray-300">
              Email:{" "}
              <a
                href="mailto:feedback@dcsystem.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                ashak_m250691cs@nitc.ac.in
              </a>
            </p>
          </div>

          {/* 🧑‍🏫 Doubt Moderation & Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all">
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              🧑‍🏫 Doubt Moderation
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              For flagged doubts, content disputes, or inappropriate replies,  
              contact our moderation admin.
            </p>
            <p className="font-medium text-gray-700 dark:text-gray-300">
              Email:{" "}
              <a
                href="mailto:moderator@dcsystem.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                venkatesh_m251107cs@nitc.ac.in
              </a>
            </p>
          </div>
        </div>

        {/* 📞 Helpline Section */}
        <div className="mt-10 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            📅 <span className="font-medium">Working Hours:</span> Monday to Friday, 9:00 AM – 6:00 PM (IST)
          </p>
          <p>
            ☎️ <span className="font-medium">Helpline:</span>{" "}
            <a
              href="tel:+911234567890"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              +91 12345 67890
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
