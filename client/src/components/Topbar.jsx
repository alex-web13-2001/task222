import React from "react";

const Topbar = () => {
  return (
    <div className="topbar">
      <div className="topbar__search">
        <span role="img" aria-hidden>
          🔍
        </span>
        <input
          type="search"
          placeholder="Search or type a command"
          style={{ border: "none", outline: "none", width: "100%", background: "transparent" }}
        />
      </div>
      <div className="topbar__actions">
        <button
          style={{
            padding: "10px 18px",
            borderRadius: "999px",
            border: "none",
            background: "var(--accent-primary)",
            color: "#fff",
            fontWeight: 600,
            boxShadow: "var(--shadow-sm)",
            cursor: "pointer"
          }}
        >
          New Project
        </button>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "#f1f5f9",
            display: "grid",
            placeItems: "center",
            fontWeight: 600
          }}
        >
          AJ
        </div>
      </div>
    </div>
  );
};

export default Topbar;
