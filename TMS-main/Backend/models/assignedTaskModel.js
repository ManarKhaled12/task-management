import mongoose from "mongoose";

const assignedTaskSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Task",
  },
  attachments: {
    type: String,
  },
});

assignedTaskSchema.index({ userId: 1, taskId: 1 }, { unique: true });

export const AssignedTask = mongoose.model("AssignedTask", assignedTaskSchema);
