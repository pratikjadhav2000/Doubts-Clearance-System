import React, { useState, useEffect } from "react";

/**
 * Login page — matches your SRS mock:
 * - Card centered on a light gray background
 * - App mark (❓) + “Doubts Clearance System”
 * - “Sign in to Continue” heading
 * - Big Google button
 * - Subtext about institute account
 */
const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  /* //Pratik commenting code - Forget login - User should login always
  // If user already has a token, send them to dashboard
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) window.location.replace("/dashboard");
  }, []);
  */ 

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = import.meta.env.VITE_API_URL+"/api/auth/google";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* App mark + title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-600 text-white text-xl font-bold">
            ?
          </div>
          <div className="leading-tight">
            <h1 className="text-xl font-semibold">Doubts Clearance</h1>
            <p className="text-sm text-gray-500 -mt-0.5">System</p>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold mb-6">Sign in to Continue</h2>

        {/* Google button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-3 rounded-lg bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
        >
          <GoogleIcon />
          {loading ? "Redirecting…" : "Continue with Google"}
        </button>

        {/* Subtext */}
        <p className="text-gray-500 text-sm mt-6">
          Use your institute Google account to sign in. Role permissions will be
          applied automatically.
        </p>
      </div>
    </div>
  );
};

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 256 262" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M255.68 133.5c0-10.9-.98-18.8-3.1-27H130.5v49.6h71.97c-1.45 12-9.32 30.1-26.8 42.3l-.24 1.6 39 30.2 2.7.27c24.8-22.9 38.55-56.7 38.55-97.0" />
    <path fill="#34A853" d="M130.5 261.1c35.1 0 64.6-11.6 86.1-31.6l-41.08-31.8c-11 7.7-25.8 13.1-45 13.1-34.47 0-63.7-22.9-74.12-54.6l-1.53.13-40.17 31.1-.53 1.4c21.33 42.5 65.1 71.1 116.93 71.1" />
    <path fill="#FBBC05" d="M56.38 156.2c-2.74-8.2-4.33-16.9-4.33-26.2s1.6-18 4.2-26.2l-.07-1.75-40.56-31.5-1.33.65C4.74 87.2 0 106.1 0 128c0 21.9 4.74 40.8 13.36 57l43.02-33.8" />
    <path fill="#EA4335" d="M130.5 50.4c24.4 0 40.8 10.5 50.2 19.3l36.6-35.8C195 12.2 165.6 0 130.5 0 78.67 0 34.9 28.6 13.36 71l43.12 33.8C66.99 72.1 96.03 50.4 130.5 50.4" />
  </svg>
);

export default LoginPage;
