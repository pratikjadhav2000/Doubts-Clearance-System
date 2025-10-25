// src/components/Loader.jsx
import React from "react";

const Loader = ({ text = "Loading..." }) => (
  <div style={{ textAlign: "center", padding: 40, color: "#666" }}>{text}</div>
);

export default Loader;
