import { Router } from "express";
import { body } from "express-validator";

import { getUsers, postUser, putUser, removeUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers);
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  ],
  postUser
);
router.put(
  "/:userId",
  [body("email").optional().isEmail(), body("password").optional().isLength({ min: 8 })],
  putUser
);
router.delete("/:userId", removeUser);

export default router;
