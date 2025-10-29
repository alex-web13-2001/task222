import { Router } from "express";
import { body } from "express-validator";

import {
  getTask,
  getTasks,
  patchTaskMove,
  postTask,
  putTask,
  removeTask
} from "../controllers/task.controller.js";

const router = Router();

router.get("/", getTasks);
router.get("/:taskId", getTask);
router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Task title is required"),
    body("project").notEmpty().withMessage("Project is required"),
    body("tags").optional().isArray(),
    body("links").optional().isArray()
  ],
  postTask
);
router.put(
  "/:taskId",
  [body("tags").optional().isArray(), body("links").optional().isArray()],
  putTask
);
router.patch(
  "/:taskId/move",
  [body("position").optional().isInt({ min: 0 }), body("columnId").optional().isString()],
  patchTaskMove
);
router.delete("/:taskId", removeTask);

export default router;
