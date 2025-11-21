const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { updateLocation, getNearbyNurses } = require("../controllers/locationController");

router.post("/update", protect, updateLocation);
router.get("/nearby-nurses", protect, getNearbyNurses);

module.exports = router;
