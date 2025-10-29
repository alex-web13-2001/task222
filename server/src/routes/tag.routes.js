import { Router } from "express";
import { body } from "express-validator";

import { getTags, postTag, putTag, removeTag } from "../controllers/tag.controller.js";

const router = Router();

router.get("/", getTags);
router.post("/", [body("name").notEmpty().withMessage("Tag name is required")], postTag);
router.put("/:tagId", [body("name").optional().isString()], putTag);
router.delete("/:tagId", removeTag);

export default router;
