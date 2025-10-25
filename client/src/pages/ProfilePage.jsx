// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // if token came via ?token=... (after Google OAuth)
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      localStorage.setItem("jwt_token", tokenFromUrl);
      // redirect user to dashboard after login
      window.location.href = "/dashboard";
      return;
    }

    const load = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch {
        setUser(null);
      }
    };
    load();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Profile</h2>
      {user ? (
        <div>
          <p>
            <b>Name:</b> {user.name}
          </p>
          <p>
            <b>Email:</b> {user.email}
          </p>
          <p>
            <b>Role:</b> {user.role}
          </p>
        </div>
      ) : (
        <p>No user data. Please login again.</p>
      )}
    </div>
  );
};

export default ProfilePage;
