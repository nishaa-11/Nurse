const Rating = require("../models/Rating");

// Rate nurse
const rateNurse = async (req, res) => {
  const { overallScore, ratings, positiveComment, improvementComment, wouldRecommend, wouldHireAgain } = req.body;
  const rating = await Rating.create({
    shift: req.body.shiftId,
    nurse: req.params.id,
    hospital: req.user._id,
    overallScore,
    ratings: ratings || {},
    positiveComment,
    improvementComment,
    wouldRecommend,
    wouldHireAgain
  });
  res.status(201).json(rating);
};

// Get nurse ratings
const getNurseRatings = async (req, res) => {
  const ratings = await Rating.find({ nurse: req.params.id });
  const average = ratings.reduce((a, b) => a + b.overallScore, 0) / (ratings.length || 1);
  res.json({ ratings, averageScore: average });
};

module.exports = { rateNurse, getNurseRatings };
