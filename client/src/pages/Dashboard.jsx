import React, { useMemo } from "react";

import MetricCard from "../components/MetricCard.jsx";
import ProjectSummaryCard from "../components/ProjectSummaryCard.jsx";
import TaskTable from "../components/TaskTable.jsx";
import { useDataContext } from "../providers/DataProvider.jsx";

const DashboardPage = () => {
  const { projects, tasks, loading } = useDataContext();

  const metrics = useMemo(() => {
    const completed = tasks.filter((task) => task.status === "done").length;
    const urgent = tasks.filter((task) => task.priority === "urgent").length;
    const inProgress = tasks.filter((task) => task.status === "in_progress").length;
    return [
      { title: "Active Projects", value: projects.length, trend: 12 },
      { title: "Tasks Completed", value: completed, trend: 8 },
      { title: "In Progress", value: inProgress, trend: 3 },
      { title: "Urgent", value: urgent, trend: -2 }
    ];
  }, [projects.length, tasks]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingBottom: 40 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p style={{ margin: "8px 0", color: "var(--text-secondary)" }}>Overview of all projects and tasks</p>
        </div>
        <div className="chip">Week 32</div>
      </header>

      {loading ? (
        <div className="section-card">Loading workspace…</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {metrics.map((metric) => (
              <MetricCard key={metric.title} {...metric} />
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div className="section-card">
                <h3 style={{ margin: 0 }}>Focus for today</h3>
                <p style={{ margin: "8px 0", color: "var(--text-secondary)" }}>
                  Keep an eye on urgent deliverables and unblock your teammates.
                </p>
                <ul style={{ margin: 0, paddingLeft: 20, color: "var(--text-secondary)" }}>
                  <li>Review wireframes with design team</li>
                  <li>Prepare feedback for onboarding flow</li>
                  <li>Sync with analytics on KPIs</li>
                </ul>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <h2 style={{ margin: 0 }}>Projects</h2>
                {projects.map((project) => (
                  <ProjectSummaryCard
                    key={project._id}
                    project={project}
                    tasks={tasks.filter((task) => (task.project?._id || task.project) === project._id)}
                  />
                ))}
              </div>
            </div>

            <TaskTable tasks={tasks} />
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
