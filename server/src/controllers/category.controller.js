import { validationResult } from "express-validator";

import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory
} from "../services/category.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await listCategories();
  res.json(categories);
});

export const postCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const category = await createCategory(req.body);
  res.status(201).json(category);
});

export const putCategory = asyncHandler(async (req, res) => {
  const category = await updateCategory(req.params.categoryId, req.body);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.json(category);
});

export const removeCategory = asyncHandler(async (req, res) => {
  const deleted = await deleteCategory(req.params.categoryId);
  if (!deleted) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.status(204).send();
});
