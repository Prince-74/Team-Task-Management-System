const express = require("express");
const {
  createTask,
  getTasksByProject,
  updateTaskStatus
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

router.get("/project/:projectId", getTasksByProject);
router.post("/project/:projectId", allowRoles("admin"), createTask);
router.patch("/:taskId/status", updateTaskStatus);

module.exports = router;
