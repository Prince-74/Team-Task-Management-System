const express = require("express");
const {
  createProject,
  getMyProjects,
  addMember,
  removeMember,
  deleteProject
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getMyProjects).post(allowRoles("admin"), createProject);
router.post("/:projectId/members", addMember);
router.delete("/:projectId/members/:memberId", removeMember);
router.delete("/:projectId", deleteProject);

module.exports = router;
