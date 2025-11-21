const Shift = require("../models/Shift");
const User = require("../models/User");

// Create micro-shift
const createShift = async (req, res) => {
  const { 
    title, 
    description, 
    date, 
    startTime, 
    endTime, 
    department, 
    paymentRate,
    requiredSpecializations,
    requiredCertifications,
    minimumExperience,
    urgencyLevel,
    bonusAmount,
    hospitalNotes
  } = req.body;
  
  const shift = await Shift.create({
    hospital: req.user._id,
    title, 
    description,
    date,
    startTime,
    endTime,
    department: department || "General",
    paymentRate: paymentRate || 40,
    requiredSpecializations: requiredSpecializations || [],
    requiredCertifications: requiredCertifications || [],
    minimumExperience: minimumExperience || 0,
    urgencyLevel: urgencyLevel || "medium",
    bonusAmount: bonusAmount || 0,
    hospitalNotes
  });
  res.status(201).json(shift);
};

// List all shifts (Surge mode shifts first)
const listShifts = async (req, res) => {
  const shifts = await Shift.find()
    .sort({ surge: -1, createdAt: -1 })   // ⭐ Surge shifts appear first
    .populate("hospital", "name email")
    .populate("nurseAssigned", "name email");

  res.json(shifts);
};

// Get shift details
const getShift = async (req, res) => {
  const shift = await Shift.findById(req.params.id)
    .populate("hospital", "name email")
    .populate("nurseAssigned", "name email");
  if (!shift) return res.status(404).json({ message: "Shift not found" });
  res.json(shift);
};

// Update shift
const updateShift = async (req, res) => {
  const shift = await Shift.findById(req.params.id);
  if (!shift) return res.status(404).json({ message: "Shift not found" });

  Object.assign(shift, req.body);
  await shift.save();
  res.json(shift);
};

// Cancel shift
const cancelShift = async (req, res) => {
  const shift = await Shift.findById(req.params.id);
  if (!shift) return res.status(404).json({ message: "Shift not found" });
  await shift.remove();
  res.json({ message: "Shift cancelled" });
};

// Nurse applies for shift
const applyShift = async (req, res) => {
  const shift = await Shift.findById(req.params.id);
  if (!shift) return res.status(404).json({ message: "Shift not found" });

  // Check if nurse already applied
  const alreadyApplied = shift.nursesApplied.some(
    application => application.nurse.toString() === req.user._id.toString()
  );
  
  if (!alreadyApplied) {
    shift.nursesApplied.push({
      nurse: req.user._id,
      appliedAt: new Date(),
      message: req.body.message || ""
    });
  }

  await shift.save();
  res.json(shift);
};

// Assign nurse from queue
const assignNurse = async (req, res) => {
  const shift = await Shift.findById(req.params.id);
  if (!shift) return res.status(404).json({ message: "Shift not found" });

  const nurseId = req.body.nurseId || (shift.nursesApplied[0] && shift.nursesApplied[0].nurse);
  if (!nurseId) return res.status(400).json({ message: "No nurse in queue" });

  shift.nurseAssigned = nurseId;
  shift.assignedAt = new Date();
  shift.status = "assigned";
  await shift.save();
  res.json(shift);
};

// Cancel assignment and auto-assign next
const cancelAssignment = async (req, res) => {
  const shift = await Shift.findById(req.params.id);
  if (!shift) return res.status(404).json({ message: "Shift not found" });

  // Remove current assigned nurse from applications
  const index = shift.nursesApplied.findIndex(
    application => application.nurse.toString() === shift.nurseAssigned.toString()
  );
  if (index > -1) shift.nursesApplied.splice(index, 1);

  // Auto-assign next nurse in queue
  shift.nurseAssigned = shift.nursesApplied[0] ? shift.nursesApplied[0].nurse : null;
  shift.status = shift.nurseAssigned ? "assigned" : "open";
  shift.assignedAt = shift.nurseAssigned ? new Date() : null;
  
  await shift.save();
  res.json(shift);
};

// View queue for shift
const viewQueue = async (req, res) => {
  const shift = await Shift.findById(req.params.id)
    .populate("nursesApplied.nurse", "name email nurseProfile.specializations nurseProfile.rating");

  if (!shift) return res.status(404).json({ message: "Shift not found" });
  res.json(shift.nursesApplied);
};

module.exports = {
  createShift,
  listShifts,
  getShift,
  updateShift,
  cancelShift,
  applyShift,
  assignNurse,
  cancelAssignment,
  viewQueue,
};
