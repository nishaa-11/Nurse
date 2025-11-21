const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { listNurses, getNurse, updateNurse, verifyNurse } = require("../controllers/nurseController");

router.get("/", protect, listNurses);
router.get("/:id", protect, getNurse);
router.put("/:id", protect, updateNurse);
router.post("/:id/verify", protect, verifyNurse);

module.exports = router;
