import express from "express";
import {
  createProject,
  getProjects,
  assignProject,
  getAcceptedProjects,
  getPendingProjects,
  getRejectedProjects,
  GetAllAssignedProjects,
  updateProject,
  deleteProject,
  deleteAssignedProject,
  updateAssignedProject,
} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.get("/GetPendingProjects", getPendingProjects);
projectRouter.get("/GetAcceptedProjects", getAcceptedProjects);
projectRouter.get("/GetRejectedProjects", getRejectedProjects);
projectRouter.get("/GetAll", getProjects);
projectRouter.get("/GetAllAssignedProjects", GetAllAssignedProjects);

projectRouter.post("/Create", createProject);
projectRouter.post("/AssignProject", assignProject);

projectRouter.put("/UpdateProject", updateProject);
projectRouter.put("/UpdateAssignedProject", updateAssignedProject);

projectRouter.delete("/DeleteProject", deleteProject);
projectRouter.delete("/DeleteAssignedProject", deleteAssignedProject);

export default projectRouter;
