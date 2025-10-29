import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    column: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Column"
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
      }
    ],
    status: {
      type: String,
      enum: ["assigned", "in_progress", "done", "backlog", "review"],
      default: "assigned"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium"
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date
    },
    links: [linkSchema],
    position: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
