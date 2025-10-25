// src/components/Navbar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const active = ({ isActive }) => ({
    fontWeight: isActive ? 700 : 500,
    textDecoration: "none",
    marginRight: 16,
    color: isActive ? "#111" : "#555",
  });

  const logout = () => {
    localStorage.removeItem("jwt_token");
    navigate("/", { replace: true });
  };

  return (
    <div style={styles.nav}>
      <div style={styles.brand} onClick={() => navigate("/dashboard")}>DCS</div>
      <div>
        <NavLink to="/dashboard" style={active}>Dashboard</NavLink>
        <NavLink to="/doubts" style={active}>All Doubts</NavLink>
        <NavLink to="/my-doubts" style={active}>My Doubts</NavLink>
        <NavLink to="/doubts/new" style={active}>Ask Doubt</NavLink>
        <button onClick={logout} style={styles.logout}>Logout</button>
      </div>
    </div>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    borderBottom: "1px solid #eee",
    background: "#fafafa",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  brand: { fontWeight: 800, cursor: "pointer", letterSpacing: 0.5 },
  logout: {
    marginLeft: 12,
    border: "1px solid #ddd",
    background: "white",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default Navbar;
