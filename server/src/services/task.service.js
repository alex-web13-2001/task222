import Column from "../models/column.model.js";
import Project from "../models/project.model.js";
import Task from "../models/task.model.js";

const populateTask = [
  { path: "project", populate: { path: "categories" } },
  "category",
  "tags",
  "assignee",
  "column"
];

export const listTasks = async (filters = {}) => {
  const query = {};

  if (filters.project) {
    query.project = filters.project;
  }
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.category) {
    query.category = filters.category;
  }
  if (filters.priority) {
    query.priority = filters.priority;
  }
  if (filters.tag) {
    query.tags = filters.tag;
  }

  return Task.find(query)
    .populate(populateTask)
    .sort({ dueDate: 1, priority: -1 })
    .lean();
};

export const getTaskById = async (id) => {
  return Task.findById(id).populate(populateTask).lean();
};

export const createTask = async (payload) => {
  const projectExists = await Project.exists({ _id: payload.project });
  if (!projectExists) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  let column = null;
  if (payload.column) {
    column = await Column.findById(payload.column);
    if (!column) {
      const error = new Error("Column not found");
      error.statusCode = 404;
      throw error;
    }
  } else {
    column = await Column.findOne({ project: payload.project, status: payload.status || "assigned" });
  }

  const resolvedStatus = column?.status || payload.status || "assigned";

  const task = await Task.create({
    title: payload.title,
    description: payload.description,
    project: payload.project,
    column: column?._id || null,
    category: payload.category || null,
    tags: payload.tags || [],
    status: resolvedStatus,
    priority: payload.priority || "medium",
    assignee: payload.assignee || null,
    startDate: payload.startDate || Date.now(),
    dueDate: payload.dueDate || null,
    links: payload.links || [],
    position: payload.position || 0
  });

  if (column) {
    await reorderColumnTasks(column._id, task._id, payload.position);
  }

  return getTaskById(task._id);
};

export const updateTask = async (id, payload) => {
  const task = await Task.findById(id);
  if (!task) {
    return null;
  }

  if (payload.column && payload.column.toString() !== task.column?.toString()) {
    await moveTask(id, { columnId: payload.column, position: payload.position });
  }

  task.title = payload.title ?? task.title;
  task.description = payload.description ?? task.description;
  task.category = payload.category ?? task.category;
  task.tags = payload.tags ?? task.tags;
  task.priority = payload.priority ?? task.priority;
  task.assignee = payload.assignee ?? task.assignee;
  task.status = payload.status ?? task.status;
  task.startDate = payload.startDate ?? task.startDate;
  task.dueDate = payload.dueDate ?? task.dueDate;
  task.links = payload.links ?? task.links;
  task.position = payload.position ?? task.position;

  await task.save();
  return getTaskById(id);
};

export const deleteTask = async (id) => {
  const task = await Task.findById(id);
  if (!task) {
    return false;
  }

  const columnId = task.column;
  await task.deleteOne();

  if (columnId) {
    await normalizeColumnTasks(columnId);
  }

  return true;
};

export const moveTask = async (taskId, { columnId, position }) => {
  const task = await Task.findById(taskId);
  if (!task) {
    return null;
  }

  const previousColumnId = task.column ? task.column.toString() : null;

  let column = null;
  if (columnId) {
    column = await Column.findById(columnId);
    if (!column) {
      const error = new Error("Target column not found");
      error.statusCode = 404;
      throw error;
    }
    task.column = column._id;
    task.status = column.status;
  }

  if (typeof position === "number") {
    task.position = position;
  }

  await task.save();

  if (task.column) {
    await reorderColumnTasks(task.column, task._id, position);
  }

  if (previousColumnId && (!column || column._id.toString() !== previousColumnId)) {
    await normalizeColumnTasks(previousColumnId);
  }

  return getTaskById(taskId);
};

const reorderColumnTasks = async (columnId, taskId, targetPosition) => {
  const tasks = await Task.find({ column: columnId }).sort({ position: 1, updatedAt: -1 });
  const movingTask = tasks.find((task) => task._id.toString() === taskId.toString());
  const remaining = tasks.filter((task) => task._id.toString() !== taskId.toString());

  const position = typeof targetPosition === "number" ? targetPosition : remaining.length;
  const normalizedPosition = Math.max(0, Math.min(position, remaining.length));
  remaining.splice(normalizedPosition, 0, movingTask);

  await Promise.all(
    remaining.map((task, index) =>
      Task.findByIdAndUpdate(task._id, { position: index }, { new: false })
    )
  );
};

const normalizeColumnTasks = async (columnId) => {
  const tasks = await Task.find({ column: columnId }).sort({ position: 1, updatedAt: -1 });
  await Promise.all(
    tasks.map((task, index) =>
      Task.findByIdAndUpdate(task._id, { position: index }, { new: false })
    )
  );
};
