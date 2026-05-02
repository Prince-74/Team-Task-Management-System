const express = require("express");
const {
  createProject,
  getMyProjects,
  addMember,
  removeMember
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getMyProjects).post(allowRoles("admin"), createProject);
router.post("/:projectId/members", allowRoles("admin"), addMember);
router.delete("/:projectId/members/:memberId", allowRoles("admin"), removeMember);

module.exports = router;
