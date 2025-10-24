import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Step 1: Check if token exists in URL (after Google login)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("jwt_token", tokenFromUrl);
      // Clean URL after storing
      window.history.replaceState({}, document.title, "/profile");
    }

    // Step 2: Get token from localStorage
    const token = localStorage.getItem("jwt_token");
    if (!token) return;

    // Step 3: Call backend to get user info
    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Profile</h1>
      {user ? (
        <>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>
          <button style={styles.logout} onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>No user data. Please login again.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "50px",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  logout: {
    marginTop: "20px",
    background: "red",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ProfilePage;
