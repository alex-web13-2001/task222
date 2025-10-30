import React, { useMemo } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import TaskCard from "./TaskCard.jsx";

const KanbanBoard = ({ columns = [], tasks = [], onTaskMove, onTaskSelect, selectedTaskId }) => {
  const columnMap = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      items: tasks.filter((task) => {
        const taskColumnId = task.column?._id || task.column;
        if (taskColumnId) {
          return taskColumnId === column._id;
        }
        return task.status === column.status;
      })
    }));
  }, [columns, tasks]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      return;
    }

    const activeTaskId = active.id;
    const sourceColumnId = active.data.current?.columnId;
    const targetColumnId = over.data.current?.columnId || over.id;
    const targetIndex = over.data.current?.index ?? 0;

    if (sourceColumnId === targetColumnId && active.data.current?.index === targetIndex) {
      return;
    }

    onTaskMove?.(activeTaskId, targetColumnId, targetIndex);
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="board-wrapper">
        {columnMap.map((column) => (
          <Column key={column._id} column={column} onTaskSelect={onTaskSelect} selectedTaskId={selectedTaskId} />
        ))}
      </div>
    </DndContext>
  );
};

const Column = ({ column, onTaskSelect, selectedTaskId }) => {
  return (
    <div className="board-column">
      <div className="board-column__header">
        <div className="board-column__title">
          <span>{column.name}</span>
          <span className="chip">{column.items.length}</span>
        </div>
        <button
          style={{
            border: "none",
            background: "rgba(79, 70, 229, 0.1)",
            color: "var(--accent-primary)",
            borderRadius: "999px",
            padding: "6px 12px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          +
        </button>
      </div>

      <SortableContext id={column._id} items={column.items.map((task) => task._id)} strategy={verticalListSortingStrategy}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {column.items.map((task, index) => (
            <SortableTaskCard
              key={task._id}
              task={task}
              columnId={column._id}
              index={index}
              onTaskSelect={onTaskSelect}
              selected={selectedTaskId === task._id}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

const SortableTaskCard = ({ task, columnId, index, onTaskSelect, selected }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task._id,
    data: { columnId, index }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: selected ? "2px solid var(--accent-primary)" : "transparent",
    borderRadius: "var(--radius-md)"
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={() => onTaskSelect?.(task._id)}>
      <TaskCard task={task} />
    </div>
  );
};

export default KanbanBoard;
