import React from "react";
import { Link } from "react-router-dom";

import ProjectSummaryCard from "../components/ProjectSummaryCard.jsx";
import { useDataContext } from "../providers/DataProvider.jsx";

const ProjectsPage = () => {
  const { projects, tasks, loading } = useDataContext();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="page-title">Projects</h1>
          <p style={{ margin: "8px 0", color: "var(--text-secondary)" }}>Manage spaces, categories and columns.</p>
        </div>
        <Link
          to="/projects/new"
          style={{
            padding: "12px 18px",
            borderRadius: "999px",
            background: "var(--accent-primary)",
            color: "#fff",
            fontWeight: 600
          }}
        >
          New Project
        </Link>
      </header>

      {loading ? (
        <div className="section-card">Loading projects…</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {projects.map((project) => (
            <ProjectSummaryCard
              key={project._id}
              project={project}
              tasks={tasks.filter((task) => (task.project?._id || task.project) === project._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
