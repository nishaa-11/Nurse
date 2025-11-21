const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { listHospitals, getHospital, updateHospital } = require("../controllers/hospitalController");

router.get("/",  listHospitals);
router.get("/:id",  getHospital);
router.put("/:id",  updateHospital);

module.exports = router;
