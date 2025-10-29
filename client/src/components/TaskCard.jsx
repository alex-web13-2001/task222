import React from "react";
import dayjs from "dayjs";

const priorityLabel = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent"
};

const TaskCard = ({ task }) => {
  const due = task.dueDate ? dayjs(task.dueDate).format("MMM D") : null;

  return (
    <div className="task-card">
      <div className="task-card__header">
        <div>
          <div className="task-card__title">{task.title}</div>
          {task.category?.name && (
            <div className="chip" style={{ background: `${task.category.color}22`, color: task.category.color }}>
              {task.category.name}
            </div>
          )}
        </div>
        <div className={`priority-chip priority-${task.priority}`}>
          {task.priority === "urgent" ? "🔥" : "⚡️"}
          {priorityLabel[task.priority]}
        </div>
      </div>
      {task.description && <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 14 }}>{task.description}</p>}
      <div className="task-card__meta">
        {task.assignee?.name && (
          <span>
            👤 <strong>{task.assignee.name}</strong>
          </span>
        )}
        {due && (
          <span className="badge-due">
            ⏰ Due {due}
          </span>
        )}
        <span className="status-badge">{formatStatus(task.status)}</span>
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

export default TaskCard;
