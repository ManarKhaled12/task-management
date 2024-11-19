import mongoose from "mongoose";

const projectStatusSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Project",
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "accepted", "rejected"],
  },
});

projectStatusSchema.index({ projectId: 1, userId: 1 }, { unique: true });

export const ProjectStatus = mongoose.model("ProjectStatus", projectStatusSchema);
