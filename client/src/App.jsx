// src/App.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AllDoubtsPage from "./pages/AllDoubtsPage";
import MyDoubtsPage from "./pages/MyDoubtsPage";
import AskDoubtPage from "./pages/AskDoubtPage";
import AdminPage from "./pages/AdminPage"; // ✅ Added this import
import NotFound from "./pages/NotFound";

// ✅ Component to handle token in URL and redirect
function RootRedirect() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      // Store JWT token from backend redirect
      localStorage.setItem("jwt_token", token);

      // Clean the URL and redirect to dashboard
      window.location.href = "/dashboard";
    }
  }, [location.search]);

  const isAuthed = !!localStorage.getItem("jwt_token");
  return isAuthed ? <Navigate to="/dashboard" replace /> : <LoginPage />;
}

function App() {
  const isAuthed = !!localStorage.getItem("jwt_token");

  return (
    <BrowserRouter>
      {isAuthed && <Navbar />}
      <Routes>
        {/* ✅ Root route — handles token or redirects */}
        <Route path="/" element={<RootRedirect />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doubts"
          element={
            <ProtectedRoute>
              <AllDoubtsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-doubts"
          element={
            <ProtectedRoute>
              <MyDoubtsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doubts/new"
          element={
            <ProtectedRoute>
              <AskDoubtPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Optional: keep a separate /login route for direct access */}
        <Route path="/login" element={<LoginPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
