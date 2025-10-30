import React from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const TaskTable = ({ tasks = [] }) => {
  return (
    <div className="section-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>All Tasks</h3>
        <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{tasks.length} tasks</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", fontSize: 12, textTransform: "uppercase", color: "var(--text-secondary)" }}>
              <th style={{ padding: "12px 0" }}>Task</th>
              <th>Status</th>
              <th>Project</th>
              <th>Assignee</th>
              <th>Priority</th>
              <th>Due</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} style={{ borderTop: "1px solid var(--border-light)" }}>
                <td style={{ padding: "12px 0", fontWeight: 600 }}>
                  <Link to={`/projects/${task.project?._id || task.project}`}>{task.title}</Link>
                </td>
                <td>
                  <span className="status-badge">{formatStatus(task.status)}</span>
                </td>
                <td style={{ color: "var(--text-secondary)" }}>{task.project?.name}</td>
                <td style={{ color: "var(--text-secondary)" }}>{task.assignee?.name || "Unassigned"}</td>
                <td>
                  <span className={`priority-chip priority-${task.priority}`}>{task.priority}</span>
                </td>
                <td style={{ color: "var(--text-secondary)" }}>
                  {task.dueDate ? dayjs(task.dueDate).format("MMM D") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const formatStatus = (status) => {
  switch (status) {
    case "in_progress":
      return "In Progress";
    case "done":
      return "Completed";
    case "backlog":
      return "Backlog";
    case "review":
      return "Review";
    default:
      return "Assigned";
  }
};

export default TaskTable;
