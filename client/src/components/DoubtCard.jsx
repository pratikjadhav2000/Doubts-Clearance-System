// src/components/DoubtCard.jsx
import React from "react";

const DoubtCard = ({ doubt }) => {
  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <h3 style={{ margin: 0 }}>{doubt.title}</h3>
        <span style={styles.badge}>{doubt.status || "OPEN"}</span>
      </div>
      <p style={styles.desc}>{doubt.description}</p>
      <div style={styles.meta}>
        <span>Asked by: {doubt.askedBy?.name || "Anonymous"}</span>
        <span>Answers: {doubt.answersCount ?? 0}</span>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 16,
    background: "white",
    marginBottom: 12,
  },
  top: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  badge: {
    fontSize: 12,
    padding: "2px 8px",
    border: "1px solid #ddd",
    borderRadius: 999,
    background: "#f5f5f5",
  },
  desc: { color: "#444", marginTop: 8 },
  meta: {
    marginTop: 12,
    display: "flex",
    justifyContent: "space-between",
    color: "#666",
    fontSize: 13,
  },
};

export default DoubtCard;
