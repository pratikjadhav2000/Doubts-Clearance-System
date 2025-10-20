import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import api from "../api";

export default function Login({ onLogin }) {
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google", {
        token: credentialResponse.credential,
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Doubts Clearance System</h1>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => console.log("Login Failed")}
      />
    </div>
  );
}
