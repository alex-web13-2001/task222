import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="section-card" style={{ marginTop: 80, textAlign: "center" }}>
      <h1 style={{ fontSize: 48, marginBottom: 16 }}>404</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>The page you are looking for could not be found.</p>
      <Link
        to="/dashboard"
        style={{
          padding: "12px 18px",
          borderRadius: "999px",
          background: "var(--accent-primary)",
          color: "#fff",
          fontWeight: 600
        }}
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
