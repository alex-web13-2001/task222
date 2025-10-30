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

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    links: [linkSchema],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
      }
    ],
    columns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Column"
      }
    ]
  },
  { timestamps: true }
);

projectSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "project"
});

export default mongoose.model("Project", projectSchema);
