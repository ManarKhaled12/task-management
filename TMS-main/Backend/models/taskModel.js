import mongoose from "mongoose";
import { AssignedTask } from "./assignedTaskModel.js";

const taskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    enum: ["backlog", "todo", "in-progress", "done"],
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

taskSchema.pre("findOneAndDelete", async function (next) {
  const task = this;
  const taskId = task._conditions._id;

  try {
    await AssignedTask.deleteMany({ taskId });
    next();
  } catch (error) {
    next(error);
  }
});

export const Task = mongoose.model("Task", taskSchema);
