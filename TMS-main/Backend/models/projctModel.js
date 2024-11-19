import mongoose from "mongoose";
import { ProjectStatus } from "./projectStatusModel.js";
import { Task } from "./taskModel.js";

const projectSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

projectSchema.pre("findOneAndDelete", async function (next) {
  const project = this;
  const projectId = project._conditions._id;

  try {
    await ProjectStatus.deleteMany({ projectId });
    await Task.deleteMany({ projectId });

    next();
  } catch (err) {
    next(err);
  }
});

export const Project = mongoose.model("Project", projectSchema);
