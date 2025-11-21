const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { rateNurse, getNurseRatings } = require("../controllers/ratingController");

router.post("/nurse/:id",  rateNurse);
router.get("/nurse/:id", getNurseRatings);

module.exports = router;
