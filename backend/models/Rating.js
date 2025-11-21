const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  shift: { type: mongoose.Schema.Types.ObjectId, ref: "Shift", required: true },
  nurse: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
