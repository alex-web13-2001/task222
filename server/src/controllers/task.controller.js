import { validationResult } from "express-validator";

import {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  moveTask,
  updateTask
} from "../services/task.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await listTasks(req.query);
  res.json(tasks);
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await getTaskById(req.params.taskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json(task);
});

export const postTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const task = await createTask(req.body);
  res.status(201).json(task);
});

export const putTask = asyncHandler(async (req, res) => {
  const task = await updateTask(req.params.taskId, req.body);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json(task);
});

export const removeTask = asyncHandler(async (req, res) => {
  const deleted = await deleteTask(req.params.taskId);
  if (!deleted) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.status(204).send();
});

export const patchTaskMove = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const task = await moveTask(req.params.taskId, req.body);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json(task);
});
