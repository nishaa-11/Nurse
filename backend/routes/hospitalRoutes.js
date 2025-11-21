const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { listHospitals, getHospital, updateHospital } = require("../controllers/hospitalController");

router.get("/", protect, listHospitals);
router.get("/:id", protect, getHospital);
router.put("/:id", protect, updateHospital);

module.exports = router;
