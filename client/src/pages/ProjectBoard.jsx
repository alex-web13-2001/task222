import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import KanbanBoard from "../components/KanbanBoard.jsx";
import TaskCard from "../components/TaskCard.jsx";
import { fetchProject } from "../api/client.js";
import { useDataContext } from "../providers/DataProvider.jsx";

const ProjectBoardPage = () => {
  const { projectId } = useParams();
  const { projects, tasks, users, actions } = useDataContext();
  const [project, setProject] = useState(() => projects.find((item) => item._id === projectId));
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [loading, setLoading] = useState(!project);

  useEffect(() => {
    if (project) {
      setLoading(false);
      return;
    }
    const loadProject = async () => {
      try {
        setLoading(true);
        const response = await fetchProject(projectId);
        setProject(response.data);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [project, projectId]);

  useEffect(() => {
    const updated = projects.find((item) => item._id === projectId);
    if (updated) {
      setProject(updated);
    }
  }, [projects, projectId]);

  const projectTasks = useMemo(
    () => tasks.filter((task) => (task.project?._id || task.project) === projectId),
    [tasks, projectId]
  );

  useEffect(() => {
    if (!selectedTaskId && projectTasks.length) {
      setSelectedTaskId(projectTasks[0]._id);
    }
  }, [projectTasks, selectedTaskId]);

  const activeTask = useMemo(() => projectTasks.find((task) => task._id === selectedTaskId), [projectTasks, selectedTaskId]);

  const handleTaskMove = async (taskId, columnId, position) => {
    await actions.moveTask(taskId, { columnId, position });
  };

  if (loading) {
    return <div className="section-card">Loading project board…</div>;
  }

  if (!project) {
    return <div className="section-card">Project not found</div>;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "3fr 1.4fr", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 className="page-title">{project.name}</h1>
            <p style={{ margin: "6px 0", color: "var(--text-secondary)" }}>{project.description}</p>
          </div>
          <button
            style={{
              padding: "12px 18px",
              borderRadius: "999px",
              border: "none",
              background: "var(--accent-primary)",
              color: "#fff",
              fontWeight: 600
            }}
          >
            New Task
          </button>
        </header>

        <KanbanBoard
          columns={project.columns || []}
          tasks={projectTasks}
          onTaskMove={handleTaskMove}
          onTaskSelect={setSelectedTaskId}
          selectedTaskId={selectedTaskId}
        />
      </div>

      <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="section-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h3 style={{ margin: 0 }}>Project Brief</h3>
          <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.6 }}>{project.description || "No description provided."}</p>
          {project.links?.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase" }}>Resources</span>
              {project.links.map((link, index) => (
                <a key={`${link.url}-${index}`} href={link.url} target="_blank" rel="noreferrer" style={{ color: "var(--accent-primary)" }}>
                  {link.label || link.url}
                </a>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {project.categories?.map((category) => (
              <span key={category._id} className="chip" style={{ background: `${category.color}22`, color: category.color }}>
                {category.name}
              </span>
            ))}
          </div>
        </div>

        <div className="section-card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ margin: 0 }}>Team</h3>
          <div style={{ display: "grid", gap: 12 }}>
            {users.map((user) => (
              <div key={user._id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "#eef2ff",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 600
                  }}
                >
                  {user.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{user.name}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>{user.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h3 style={{ margin: 0 }}>Task Details</h3>
          {activeTask ? <TaskCard task={activeTask} /> : <p style={{ margin: 0, color: "var(--text-secondary)" }}>Select a task to view details.</p>}
        </div>
      </aside>
    </div>
  );
};

export default ProjectBoardPage;
