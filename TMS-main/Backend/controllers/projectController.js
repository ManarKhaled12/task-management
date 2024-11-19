import { Project } from "../models/projctModel.js";
import { User } from "../models/userModel.js";
import { ProjectStatus } from "../models/projectStatusModel.js";

async function createProject(req, res) {
  const { title } = req.body;
  try {
    const newProject = new Project({ title });
    await newProject.save();
    return res.status(200).json();
  } catch (error) {
    console.log("Error creating project", error);
    return res.status(500).json({ msg: "Error creating project" });
  }
}

async function getProjects(req, res) {
  try {
    const projects = await Project.find({});
    return res.status(200).json(projects);
  } catch (error) {
    console.log("Error getting projects", error);
    return res.status(500).json({ msg: "Error getting projects" });
  }
}

async function assignProject(req, res) {
  try {
    const { userId, projectId, status } = req.body;
    const user = await User.findById(userId);
    if (!user) throw Error("user not found");

    const project = await Project.findById(projectId);
    if (!project) throw Error("project not found");

    const assignedProject = new ProjectStatus({ userId, projectId, status });
    await assignedProject.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log("Error while assigning project", error);
    return res.status(500).json({ msg: "Error assigning project" });
  }
}

async function getPendingProjects(req, res) {
  const userId = req.query.userId;
  const response = [];

  try {
    const pendingProjects = await ProjectStatus.find({ status: "pending", userId });

    await Promise.all(
      pendingProjects.map(async (pendingProject) => {
        const project = await Project.findById(pendingProject.projectId);
        response.push({
          userId: pendingProject.userId,
          projectId: pendingProject.projectId,
          status: pendingProject.status,
          title: project.title,
        });
      })
    );

    return res.status(200).json(response);
  } catch (error) {
    console.log("Error while getting pending projects", error);
    return res.status(500).json({ msg: "Error while getting pending projects" });
  }
}

async function getRejectedProjects(req, res) {
  const userId = req.query.userId;
  const response = [];

  try {
    const rejectedProjects = await ProjectStatus.find({ status: "rejected", userId });
    if (!rejectedProjects) return res.status(200).json([]);

    await Promise.all(
      rejectedProjects.map(async (rejectedProject) => {
        const project = await Project.findById(rejectedProject.projectId);

        response.push({
          userId: rejectedProject.userId,
          projectId: rejectedProject.projectId,
          status: rejectedProject.status,
          title: project ? project.title : "",
        });
      })
    );

    return res.status(200).json(response);
  } catch (error) {
    console.log("Error while getting rejected projects", error);
    return res.status(500).json({ msg: "Error while getting rejected projects" });
  }
}

async function getAcceptedProjects(req, res) {
  const userId = req.query.userId;
  const response = [];

  try {
    const accepetedProjects = await ProjectStatus.find({ status: "accepted", userId });
    if (!accepetedProjects) return res.status(200).json([]);

    await Promise.all(
      accepetedProjects.map(async (accepetedProject) => {
        const project = await Project.findById(accepetedProject.projectId);
        response.push({
          userId: accepetedProject.userId,
          projectId: accepetedProject.projectId,
          status: accepetedProject.status,
          title: project ? project.title : "",
        });
      })
    );

    return res.status(200).json(response);
  } catch (error) {
    console.log("Error while getting accepted projects", error);
    return res.status(500).json({ msg: "Error while getting accepted projects" });
  }
}

async function GetAllAssignedProjects(req, res) {
  try {
    const assignedProjects = await ProjectStatus.find({});
    return res.status(200).json(assignedProjects);
  } catch (error) {
    console.log("Error getting Assigned projects", error);
    return res.status(500).json({ msg: "Error getting Assigned projects" });
  }
}

async function updateProject(req, res) {
  const projectId = req.query.id;
  const { title } = req.body;
  try {
    const project = await Project.findById(projectId);
    project.title = title;
    await project.save();
    return res.sendStatus(204);
  } catch (error) {
    console.log("Error Updating project", error);
    return res.status(500).json({ msg: "Error updating project" });
  }
}

async function deleteProject(req, res) {
  const projectId = req.query.id;
  try {
    await Project.findOneAndDelete({ _id: projectId });
    return res.sendStatus(204);
  } catch (error) {
    console.log("Error while deleting the project", error);
    return res.status(500).json({ msg: "Error while deleting the project" });
  }
}

async function deleteAssignedProject(req, res) {
  const userId = req.query.userId;
  const projectId = req.query.projectId;

  try {
    await ProjectStatus.findOneAndDelete({ userId, projectId });
    return res.sendStatus(204);
  } catch (error) {
    console.log("Error while deleting the assigned project", error);
    return res.status(500).json({ msg: "Error while deleting the assigned project" });
  }
}

async function updateAssignedProject(req, res) {
  const { userId, projectId, status } = req.body;

  try {
    await ProjectStatus.findOneAndUpdate({ userId, projectId }, { status });
    return res.sendStatus(200).json(res.ok);
  } catch (error) {
    console.log("Error while updating the assigned project", error);
    return res.status(500).json({ msg: "Error while updating the assigned project" });
  }
}

export {
  createProject,
  getProjects,
  assignProject,
  getPendingProjects,
  getAcceptedProjects,
  getRejectedProjects,
  GetAllAssignedProjects,
  updateProject,
  deleteProject,
  deleteAssignedProject,
  updateAssignedProject,
};
