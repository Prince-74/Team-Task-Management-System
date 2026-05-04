const mongoose = require("mongoose");
const Project = require("../models/Project");
const User = require("../models/User");

const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      res.status(400);
      throw new Error("Project name is required");
    }

    const project = await Project.create({
      name,
      description,
      admin: req.user._id,
      members: [req.user._id]
    });

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { projects: project._id }
    });

    const populated = await Project.findById(project._id)
      .populate("admin", "name email role")
      .populate("members", "name email role");

    return res.status(201).json(populated);
  } catch (error) {
    return next(error);
  }
};

const getMyProjects = async (req, res, next) => {
  try {
    let projects;
    if (req.user && req.user.role === "admin") {
      // application admins can see all projects
      projects = await Project.find({})
        .populate("admin", "name email role")
        .populate("members", "name email role")
        .sort({ createdAt: -1 });
    } else {
      projects = await Project.find({ members: req.user._id })
        .populate("admin", "name email role")
        .populate("members", "name email role")
        .sort({ createdAt: -1 });
    }

    return res.json(projects);
  } catch (error) {
    return next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { memberId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(memberId)) {
      res.status(400);
      throw new Error("Invalid project or member id");
    }

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    if (String(project.admin) !== String(req.user._id) && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Only project admin or application admin can add members");
    }

    const member = await User.findById(memberId);
    if (!member) {
      res.status(404);
      throw new Error("Member not found");
    }

    project.members.addToSet(member._id);
    await project.save();
    await User.findByIdAndUpdate(member._id, {
      $addToSet: { projects: project._id }
    });

    const populated = await Project.findById(project._id)
      .populate("admin", "name email role")
      .populate("members", "name email role");

    return res.json(populated);
  } catch (error) {
    return next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const { projectId, memberId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(memberId)) {
      res.status(400);
      throw new Error("Invalid project or member id");
    }

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    if (String(project.admin) !== String(req.user._id) && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Only project admin or application admin can remove members");
    }

    if (String(project.admin) === String(memberId)) {
      res.status(400);
      throw new Error("Admin cannot be removed from project");
    }

    project.members = project.members.filter((member) => String(member) !== String(memberId));
    await project.save();
    await User.findByIdAndUpdate(memberId, {
      $pull: { projects: project._id }
    });

    const populated = await Project.findById(project._id)
      .populate("admin", "name email role")
      .populate("members", "name email role");

    return res.json(populated);
  } catch (error) {
    return next(error);
  }
};

const deleteProject = async (req, res, next) => {
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

    // Only project admin (creator) or application admin can delete
    if (String(project.admin) !== String(req.user._id) && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Only project admin or application admin can delete project");
    }

    // Remove project reference from users
    await User.updateMany({ projects: project._id }, { $pull: { projects: project._id } });

    await Project.findByIdAndDelete(project._id);

    return res.json({ message: "Project deleted" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createProject,
  getMyProjects,
  addMember,
  removeMember
  ,deleteProject
};
