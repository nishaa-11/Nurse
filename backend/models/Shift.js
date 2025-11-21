const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  nursesApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  nurseAssigned: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  surge: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Shift = mongoose.model("Shift", shiftSchema);
module.exports = Shift;
