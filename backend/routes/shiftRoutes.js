const express = require("express");
const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");
const {
  createShift, listShifts, getShift, updateShift, cancelShift,
  applyShift, assignNurse, cancelAssignment, viewQueue
} = require("../controllers/shiftController");

router.get("/", listShifts);
router.post("/",  createShift);
router.get("/:id",  getShift);
router.put("/:id",  updateShift);
router.delete("/:id", cancelShift);

router.post("/:id/apply", applyShift);
router.post("/:id/assign", assignNurse);
router.post("/:id/cancel", cancelAssignment);
router.get("/:id/queue",viewQueue);

module.exports = router;
