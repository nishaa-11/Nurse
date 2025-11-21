const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { rateNurse, getNurseRatings } = require("../controllers/ratingController");

router.post("/nurse/:id", protect, rateNurse);
router.get("/nurse/:id", protect, getNurseRatings);

module.exports = router;
