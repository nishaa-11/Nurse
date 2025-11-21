const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { activateSurge, deactivateSurge } = require("../controllers/surgeController");

router.post("/activate", protect, activateSurge);
router.post("/deactivate", protect,  deactivateSurge);

module.exports = router;
