import React from "react";

const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Doubts Clearance System</h1>
      <p style={styles.text}>
        Login using your <b>@nitc.ac.in</b> account
      </p>
      <button style={styles.button} onClick={handleGoogleLogin}>
        Login with Google
      </button>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f8fa",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  text: {
    fontSize: "1rem",
    color: "#444",
    marginBottom: "1rem",
  },
  button: {
    backgroundColor: "#4285F4",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
  },
};

export default LoginPage;
