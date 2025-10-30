import mongoose from "mongoose";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    }
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = scryptSync(this.password, salt, 64).toString("hex");
    this.password = `${salt}:${derivedKey}`;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = function (candidate) {
  const [salt, storedHash] = this.password.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const candidateHash = scryptSync(candidate, salt, 64).toString("hex");

  return timingSafeEqual(Buffer.from(storedHash, "hex"), Buffer.from(candidateHash, "hex"));
};

export default mongoose.model("User", userSchema);
