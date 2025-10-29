import { validationResult } from "express-validator";

import {
  createProject,
  deleteProject,
  getProjectById,
  listProjects,
  updateProject,
  upsertColumns
} from "../services/project.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProjects = asyncHandler(async (_req, res) => {
  const projects = await listProjects();
  res.json(projects);
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await getProjectById(req.params.projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  res.json(project);
});

export const postProject = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const project = await createProject(req.body);
  res.status(201).json(project);
});

export const putProject = asyncHandler(async (req, res) => {
  const project = await updateProject(req.params.projectId, req.body);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  res.json(project);
});

export const putProjectColumns = asyncHandler(async (req, res) => {
  const project = await upsertColumns(req.params.projectId, req.body.columns || []);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  res.json(project);
});

export const removeProject = asyncHandler(async (req, res) => {
  const deleted = await deleteProject(req.params.projectId);
  if (!deleted) {
    return res.status(404).json({ message: "Project not found" });
  }
  res.status(204).send();
});
