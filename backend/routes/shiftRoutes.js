const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createShift, listShifts, getShift, updateShift, cancelShift,
  applyShift, assignNurse, cancelAssignment, viewQueue
} = require("../controllers/shiftController");

router.get("/", protect, listShifts);
router.post("/", protect, createShift);
router.get("/:id", protect, getShift);
router.put("/:id", protect, updateShift);
router.delete("/:id", protect, cancelShift);

router.post("/:id/apply", protect, applyShift);
router.post("/:id/assign", protect, assignNurse);
router.post("/:id/cancel", protect, cancelAssignment);
router.get("/:id/queue", protect, viewQueue);

module.exports = router;
