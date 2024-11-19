import { AssignedTask } from "../models/assignedTaskModel.js";
import { Project } from "../models/projctModel.js";
import { ProjectStatus } from "../models/projectStatusModel.js";
import { Task } from "../models/taskModel.js";
import { User } from "../models/userModel.js";

async function getTasks(req, res) {
  const userId = req.query.userId;
  const projectId = req.query.projectId;
  const role = +req.query.role;

  if (!userId || !projectId || !role) return res.sendStatus(400);

  try {
    const tasksByProject = await Task.find({ projectId });
    const taskToSend = tasksByProject.map((task) => ({
      ...task._doc,
      Editable: role === 2,
    }));
    if (role === 2) return res.status(200).json(taskToSend);

    const userTasks = await AssignedTask.find({ userId });

    userTasks.forEach((userTask) => {
      for (const taskIndex in taskToSend) {
        if (String(userTask.taskId) === String(taskToSend[taskIndex]._id)) {
          taskToSend[taskIndex].Editable = true;
          break;
        }
      }
    });

    return res.status(200).json(taskToSend);
  } catch (error) {
    console.log("Error happened when getting tasks", error);
    return res.status(500).json({ msg: "Error occurred when getting tasks" });
  }
}

async function createTask(req, res) {
  const { title, status, description, projectId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) throw Error("project not found");

    const newTask = new Task({ title, status, description, projectId });
    await newTask.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log("Error happened when creating task", error);
    return res.status(500).json({ msg: "Error occurred when creating task" });
  }
}

async function updateTask(req, res) {
  const { id, title, status, description, projectId } = req.body;

  try {
    const task = await Task.findById(id);

    task.title = title;
    task.description = description;
    task.projectId = projectId;
    task.status = status;
    await task.save();
    return res.sendStatus(204);
  } catch (error) {
    console.log("Erorr happened while updating the task", error);
    return res.status(500).json({ msg: "Error occurred when updating task" });
  }
}

async function deleteTask(req, res) {
  const id = req.query.id;

  try {
    await Task.findOneAndDelete({ _id: id });
    return res.sendStatus(204);
  } catch (error) {
    console.log("Error happend while deleting task", error);
    return res.status(500).json({ msg: "Error happend while deleting task" });
  }
}

async function assignTask(req, res) {
  const { userId, taskId, attachments } = req.body;
  //   const isAssigned = await  AssignedTask.find({})

  try {
    const newAssignedTask = await new AssignedTask({ userId, taskId, attachments });
    await newAssignedTask.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log("Erorr happened while assigning task", error);
    return res.status(500).json({ msg: "Erorr happened while assigning task" });
  }
}

async function deleteAssignedTask(req, res) {
  const userId = req.query.userId;
  const taskId = req.query.taskId;

  try {
    await AssignedTask.findOneAndDelete({ userId: userId, taskId: taskId });
    return res.sendStatus(204);
  } catch (error) {
    console.log("Error happend while deleting task", error);
    return res.status(500).json({ msg: "Erorr happened while deleting task" });
  }
}

async function getAssignedDevs(req, res) {
  const taskId = req.query.taskId;
  try {
    const response = [];
    const assignedTasks = await AssignedTask.find({ taskId });

    await Promise.all(
      assignedTasks.map(async (task) => {
        const userData = await User.findById(task.userId);
        if (!userData) throw new Error("User not found");

        response.push({
          id: task.userId,
          userName: `${userData.firstName} ${userData.lastName}`,
        });
      })
    );

    return res.status(200).json(response);
  } catch (error) {
    console.log("Error happend while getting assigned devs", error);
    return res.status(500).json({ msg: "Erorr happened while getting assigned devs" });
  }
}

async function getUnassginedDevs(req, res) {
  const taskId = req.query.taskId;
  const response = [];

  try {
    const task = await Task.findById(taskId);
    const acceptedProjects = await ProjectStatus.find({
      projectId: task.projectId,
      status: "accepted",
    });

    await Promise.all(
      acceptedProjects.map(async (acceptedProject) => {
        const found = await AssignedTask.findOne({ taskId, userId: acceptedProject.userId });
        if (found) return;

        const user = await User.findById(acceptedProject.userId);
        response.push({
          id: acceptedProject.userId,
          userName: `${user.firstName} ${user.lastName}`,
        });
      })
    );

    return res.status(200).json(response);
  } catch (error) {
    console.log("Error happend while getting the un assgined devs", error);
    return res.status(500).json({ msg: "Erorr happened while getting the un assgined devs" });
  }
}

async function getAllAttachments(req, res) {
  // task title
  //first name
  //last name
  // attachments
  try {
    const response = [];
    const attachments = await AssignedTask.find({ attahcments: { $ne: "" } });
    await Promise.all(
      attachments.map(async (attachment) => {
        const task = await Task.findById(attachment.taskId);
        const user = await User.findById(attachment.userId);

        response.push({
          userName: `${user.firstName} ${user.lastName}`,
          task: task.title,
          attachment: attachment.attachments,
        });
      })
    );

    return res.status(200).json(response);
  } catch (error) {
    console.log("Error happend while getting the attachments", error);
    return res.status(500).json({ msg: "Error happend while getting the attachements" });
  }
}

async function AttachFile(req, res) {
  const { UserId, TaskId } = req.body;
  const file = req.file;
  const host = req.get("host");

  try {
    const assginedTask = await AssignedTask.findOne({ userId: UserId, taskId: TaskId });
    if (!file) return res.status(400).json({ msg: "No file was sent" });

    assginedTask.attachments = `https://${host}/uploads/${file.originalname}`;
    await assginedTask.save();

    return res.status(200).json();
  } catch (error) {
    console.log("Error happend while uploading file", error);
    return res.status(500).json({ msg: "Error happend while uploading file" });
  }
}

export {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  deleteAssignedTask,
  getAssignedDevs,
  getUnassginedDevs,
  getAllAttachments,
  AttachFile,
};
