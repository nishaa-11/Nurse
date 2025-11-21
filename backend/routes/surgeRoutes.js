const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { activateSurge, deactivateSurge } = require("../controllers/surgeController");

router.post("/activate", activateSurge);
router.post("/deactivate", deactivateSurge);

module.exports = router;
