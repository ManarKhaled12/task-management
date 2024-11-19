import express from "express";
import multer from "multer";
import {
  assignTask,
  AttachFile,
  createTask,
  deleteAssignedTask,
  deleteTask,
  getAllAttachments,
  getAssignedDevs,
  getTasks,
  getUnassginedDevs,
  updateTask,
} from "../controllers/taskController.js";

const taskRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

taskRouter.get("/GetTasks", getTasks);
taskRouter.get("/GetAssignedDevs", getAssignedDevs);
taskRouter.get("/GetUnassignedDevs", getUnassginedDevs);
taskRouter.get("/GetAllAttachedTasks", getAllAttachments);

taskRouter.post("/Create", createTask);
taskRouter.post("/AssignTask", assignTask);
taskRouter.post("/AttachFile", upload.single("File"), AttachFile);

taskRouter.put("/UpdateTask", updateTask);

taskRouter.delete("/DeleteAssignedTask", deleteAssignedTask);
taskRouter.delete("/DeleteTask", deleteTask);

export default taskRouter;
