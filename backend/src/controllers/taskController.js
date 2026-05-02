const mongoose = require("mongoose");
const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

const createTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title, description, dueDate, priority, assignedTo } = req.body;

    if (!title || !dueDate || !assignedTo) {
      res.status(400);
      throw new Error("Title, dueDate, and assignedTo are required");
    }

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(assignedTo)) {
      res.status(400);
      throw new Error("Invalid project or user id");
    }

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    if (String(project.admin) !== String(req.user._id)) {
      res.status(403);
      throw new Error("Only project admin can create tasks");
    }

    const assignee = await User.findById(assignedTo);
    if (!assignee) {
      res.status(404);
      throw new Error("Assigned user not found");
    }

    const isMember = project.members.some((memberId) => String(memberId) === String(assignedTo));
    if (!isMember) {
      res.status(400);
      throw new Error("Assigned user must be a project member");
    }

    const task = await Task.create({
      project: project._id,
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      createdBy: req.user._id
    });

    project.tasks.addToSet(task._id);
    await project.save();

    const populated = await Task.findById(task._id)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    return res.status(201).json(populated);
  } catch (error) {
    return next(error);
  }
};

const getTasksByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400);
      throw new Error("Invalid project id");
    }

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    const isMember = project.members.some((memberId) => String(memberId) === String(req.user._id));
    if (!isMember) {
      res.status(403);
      throw new Error("Only project members can view tasks");
    }

    // If the requester is the project admin, return all tasks.
    // Otherwise, members should see only tasks assigned to them.
    const isProjectAdmin = String(project.admin) === String(req.user._id) || req.user.role === "admin";

    const query = isProjectAdmin
      ? { project: projectId }
      : { project: projectId, assignedTo: req.user._id };

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    return res.json(tasks);
  } catch (error) {
    return next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!["To Do", "In Progress", "Done"].includes(status)) {
      res.status(400);
      throw new Error("Invalid status value");
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      res.status(400);
      throw new Error("Invalid task id");
    }

    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    if (String(task.assignedTo) !== String(req.user._id)) {
      res.status(403);
      throw new Error("Only assigned user can update status");
    }

    task.status = status;
    await task.save();

    const populated = await Task.findById(task._id)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    return res.json(populated);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  updateTaskStatus
};
