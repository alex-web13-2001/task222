import { validationResult } from "express-validator";

import { createUser, deleteUser, listUsers, updateUser } from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await listUsers();
  res.json(users);
});

export const postUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await createUser(req.body);
  res.status(201).json(user);
});

export const putUser = asyncHandler(async (req, res) => {
  const user = await updateUser(req.params.userId, req.body);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

export const removeUser = asyncHandler(async (req, res) => {
  const deleted = await deleteUser(req.params.userId);
  if (!deleted) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(204).send();
});
