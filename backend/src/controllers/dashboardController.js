const Task = require("../models/Task");
const Project = require("../models/Project");

const getDashboardStats = async (req, res, next) => {
  try {
    const projects = await Project.find({ members: req.user._id }).select("_id");
    const projectIds = projects.map((project) => project._id);

    const taskFilter = { project: { $in: projectIds } };
    const tasks = await Task.find(taskFilter).populate("assignedTo", "name email");

    const totalTasks = tasks.length;
    const tasksByStatus = {
      "To Do": 0,
      "In Progress": 0,
      Done: 0
    };

    const tasksPerUserMap = {};
    let overdueTasks = 0;
    const now = new Date();

    for (const task of tasks) {
      tasksByStatus[task.status] = (tasksByStatus[task.status] || 0) + 1;
      const userName = task.assignedTo?.name || "Unassigned";
      tasksPerUserMap[userName] = (tasksPerUserMap[userName] || 0) + 1;

      if (task.status !== "Done" && new Date(task.dueDate) < now) {
        overdueTasks += 1;
      }
    }

    const tasksPerUser = Object.entries(tasksPerUserMap).map(([user, count]) => ({
      user,
      count
    }));

    return res.json({
      totalTasks,
      tasksByStatus,
      tasksPerUser,
      overdueTasks
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getDashboardStats };
