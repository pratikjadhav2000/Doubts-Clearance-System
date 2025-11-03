import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 border-t border-blue-100 dark:border-gray-700 py-6 px-6 mt-auto shadow-inner transition-all duration-300">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        {/* 🌿 Left Section */}
        <p className="text-center sm:text-left mb-3 sm:mb-0">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Doubts Clearance System
          </span>{" "}
          — Empowering Students to Learn & Grow.
        </p>

        {/* 🌐 Right Section */}
        <div className="flex items-center gap-5">
          <a
            href="/about"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-105"
          >
            About
          </a>
          <a
            href="/contact"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-105"
          >
            Contact
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-105 flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.21 11.44c.6.11.82-.26.82-.58v-2.1c-3.34.73-4.04-1.61-4.04-1.61-.54-1.37-1.32-1.74-1.32-1.74-1.08-.75.08-.74.08-.74 1.19.08 1.82 1.22 1.82 1.22 1.06 1.82 2.78 1.29 3.46.98.11-.77.41-1.29.75-1.59-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.4 1.24-3.25-.12-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0112 6.8a11.5 11.5 0 012.99.4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.64.24 2.86.12 3.16.77.85 1.24 1.93 1.24 3.25 0 4.63-2.8 5.65-5.48 5.95.42.36.8 1.08.8 2.18v3.24c0 .32.22.7.83.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </div>

      {/* 🌸 Divider line */}
      <div className="mt-4 border-t border-blue-100 dark:border-gray-700"></div>

      {/* ❤️ Bottom Tagline */}
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
        Made with ❤️ by{" "}
        <span className="font-medium text-blue-500 dark:text-blue-400">
          Your Team
        </span>
      </p>
    </footer>
  );
};

export default Footer;
