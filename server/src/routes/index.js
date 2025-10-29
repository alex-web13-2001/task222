import { Router } from "express";

import categoryRouter from "./category.routes.js";
import projectRouter from "./project.routes.js";
import tagRouter from "./tag.routes.js";
import taskRouter from "./task.routes.js";
import userRouter from "./user.routes.js";

const router = Router();

router.use("/projects", projectRouter);
router.use("/tasks", taskRouter);
router.use("/categories", categoryRouter);
router.use("/tags", tagRouter);
router.use("/users", userRouter);

export default router;
