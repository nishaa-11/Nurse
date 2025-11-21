const User = require("../models/User");

// List all hospitals
const listHospitals = async (req, res) => {
  const hospitals = await User.find({ role: "hospital" }).select("-password");
  res.json(hospitals);
};

// Get hospital details
const getHospital = async (req, res) => {
  const hospital = await User.findById(req.params.id).select("-password");
  if (!hospital) return res.status(404).json({ message: "Hospital not found" });
  res.json(hospital);
};

// Update hospital info
const updateHospital = async (req, res) => {
  const hospital = await User.findById(req.params.id);
  if (!hospital) return res.status(404).json({ message: "Hospital not found" });

  Object.assign(hospital, req.body);
  await hospital.save();
  res.json(hospital);
};

module.exports = { listHospitals, getHospital, updateHospital };
