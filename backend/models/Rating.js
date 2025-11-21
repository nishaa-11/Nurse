const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  shift: { type: mongoose.Schema.Types.ObjectId, ref: "Shift", required: true },
  nurse: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // Overall rating
  overallScore: { type: Number, required: true, min: 1, max: 5 },
  
  // Detailed ratings
  ratings: {
    punctuality: { type: Number, min: 1, max: 5 },
    professionalism: { type: Number, min: 1, max: 5 },
    skillLevel: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    teamwork: { type: Number, min: 1, max: 5 },
    patientCare: { type: Number, min: 1, max: 5 }
  },
  
  // Comments
  positiveComment: { type: String },
  improvementComment: { type: String },
  privateNotes: { type: String }, // Only visible to hospital
  
  // Verification
  verified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  
  // Response from nurse
  nurseResponse: { type: String },
  nurseRespondedAt: { type: Date },
  
  // Flags
  flagged: { type: Boolean, default: false },
  flagReason: { type: String },
  
  // Recommendation
  wouldRecommend: { type: Boolean },
  wouldHireAgain: { type: Boolean }
}, {
  timestamps: true
});

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
