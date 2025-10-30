import { Router } from "express";
import { body } from "express-validator";

import {
  getProject,
  getProjects,
  postProject,
  putProject,
  putProjectColumns,
  removeProject
} from "../controllers/project.controller.js";

const router = Router();

const linkValidator = body("links").optional().isArray();
const categoriesValidator = body("categories").optional().isArray();

router.get("/", getProjects);
router.get("/:projectId", getProject);
router.post(
  "/",
  [body("name").notEmpty().withMessage("Project name is required"), linkValidator, categoriesValidator],
  postProject
);
router.put("/:projectId", [linkValidator, categoriesValidator], putProject);
router.put(
  "/:projectId/columns",
  [
    body("columns").isArray().withMessage("Columns payload must be an array"),
    body("columns.*.name").notEmpty().withMessage("Column name is required"),
    body("columns.*.status").notEmpty().withMessage("Column status is required")
  ],
  putProjectColumns
);
router.delete("/:projectId", removeProject);

export default router;
