const Rating = require("../models/Rating");

// Rate nurse
const rateNurse = async (req, res) => {
  const { score, comment } = req.body;
  const rating = await Rating.create({
    shift: req.body.shiftId,
    nurse: req.params.id,
    hospital: req.user._id,
    score,
    comment,
  });
  res.status(201).json(rating);
};

// Get nurse ratings
const getNurseRatings = async (req, res) => {
  const ratings = await Rating.find({ nurse: req.params.id });
  const average = ratings.reduce((a, b) => a + b.score, 0) / (ratings.length || 1);
  res.json({ ratings, averageScore: average });
};

module.exports = { rateNurse, getNurseRatings };
