import { Router } from "express";
import { body } from "express-validator";

import {
  getCategories,
  postCategory,
  putCategory,
  removeCategory
} from "../controllers/category.controller.js";

const router = Router();

router.get("/", getCategories);
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Category name is required"),
    body("color").optional().isString(),
    body("description").optional().isString()
  ],
  postCategory
);
router.put(
  "/:categoryId",
  [body("name").optional().isString(), body("color").optional().isString()],
  putCategory
);
router.delete("/:categoryId", removeCategory);

export default router;
