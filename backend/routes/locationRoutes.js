const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { updateLocation, getNearbyNurses } = require("../controllers/locationController");

router.post("/update", updateLocation);
router.get("/nearby-nurses", getNearbyNurses);

module.exports = router;
