import React from "react";
import { Link } from "react-router-dom";

const ProjectSummaryCard = ({ project, tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="section-card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0 }}>{project.name}</h3>
          <p style={{ margin: "6px 0", color: "var(--text-secondary)" }}>{project.description}</p>
        </div>
        <Link
          to={`/projects/${project._id}`}
          style={{
            padding: "10px 16px",
            background: "var(--accent-primary)",
            color: "#fff",
            borderRadius: "999px",
            fontWeight: 600
          }}
        >
          Open Board
        </Link>
      </div>
      <div>
        <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 8 }}>
          Progress {completedTasks}/{totalTasks}
        </div>
        <div
          style={{
            width: "100%",
            height: 10,
            borderRadius: 999,
            background: "#e2e8f0",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectSummaryCard;
