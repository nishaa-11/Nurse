const Shift = require("../models/Shift");

// Activate surge mode for all shifts
const activateSurge = async (req, res) => {
  await Shift.updateMany({}, { surge: true });
  res.json({ message: "Surge mode activated" });
};

// Deactivate surge mode
const deactivateSurge = async (req, res) => {
  await Shift.updateMany({}, { surge: false });
  res.json({ message: "Surge mode deactivated" });
};

module.exports = { activateSurge, deactivateSurge };
