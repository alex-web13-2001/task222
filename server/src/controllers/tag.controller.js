import { validationResult } from "express-validator";

import { createTag, deleteTag, listTags, updateTag } from "../services/tag.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getTags = asyncHandler(async (_req, res) => {
  const tags = await listTags();
  res.json(tags);
});

export const postTag = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const tag = await createTag(req.body);
  res.status(201).json(tag);
});

export const putTag = asyncHandler(async (req, res) => {
  const tag = await updateTag(req.params.tagId, req.body);
  if (!tag) {
    return res.status(404).json({ message: "Tag not found" });
  }
  res.json(tag);
});

export const removeTag = asyncHandler(async (req, res) => {
  const deleted = await deleteTag(req.params.tagId);
  if (!deleted) {
    return res.status(404).json({ message: "Tag not found" });
  }
  res.status(204).send();
});
