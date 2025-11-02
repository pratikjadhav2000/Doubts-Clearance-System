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
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AllDoubtsPage from "./pages/AllDoubtsPage";
import MyDoubtsPage from "./pages/MyDoubtsPage";
import AskDoubtPage from "./pages/AskDoubtPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";


/**
 * RootRedirect
 * - Captures ?token=...&role=...
 * - Saves token + role in localStorage
 * - Redirects admin → /admin, others → /dashboard
 */
function RootRedirect() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const role = params.get("role");

    if (token) {
      localStorage.setItem("jwt_token", token);
      if (role) localStorage.setItem("user_role", role);

      // redirect based on role
      if (role === "ADMIN") {
        window.location.replace("/dashboard");
      } else {
        window.location.replace("/dashboard");
      }
    }
  }, [location.search]);

  const token = localStorage.getItem("jwt_token");
  return token ? <Navigate to="/dashboard" replace /> : <LoginPage />;
}

function App() {
  const isAuthed = !!localStorage.getItem("jwt_token");

  return (
    <BrowserRouter>
      {isAuthed && <Navbar />}
      <Routes>
        {/* Root: Handles Google login redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Authenticated routes */}
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

        {/* Login + 404 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
       {/* ✅ Footer added globally */}
      <Footer />
    </BrowserRouter>
  );
}


export default App;
