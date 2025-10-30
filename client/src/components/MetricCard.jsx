import React from "react";

const MetricCard = ({ title, value, trend }) => {
  return (
    <div
      className="section-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        background: "linear-gradient(145deg, rgba(79, 70, 229, 0.08), rgba(79, 70, 229, 0))"
      }}
    >
      <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{title}</span>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
      {trend && (
        <span style={{ fontSize: 12, color: trend > 0 ? "#16a34a" : "#ef4444" }}>
          {trend > 0 ? "▲" : "▼"} {Math.abs(trend)}%
        </span>
      )}
    </div>
  );
};

export default MetricCard;
