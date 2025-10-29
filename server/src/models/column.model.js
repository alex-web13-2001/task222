import mongoose from "mongoose";

const columnSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ["assigned", "in_progress", "done", "backlog", "review"],
      default: "assigned"
    },
    order: {
      type: Number,
      default: 0
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Column", columnSchema);
