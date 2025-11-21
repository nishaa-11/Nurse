const Shift = require("../models/Shift");
const User = require("../models/User");

// Create micro-shift
const createShift = async (req, res) => {
  const { title, description, date, startTime, endTime } = req.body;
  const shift = await Shift.create({
    hospital: req.user._id,
    title,
    description,
    date,
    startTime,
    endTime,
  });
  res.status(201).json(shift);
};

// List all shifts
const listShifts = async (req, res) => {
  const shifts = await Shift.find().populate("hospital", "name email").populate("nurseAssigned", "name email");
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
  if (!shift.nursesApplied.includes(req.user._id)) shift.nursesApplied.push(req.user._id);
  await shift.save();
  res.json(shift);
};

// Assign nurse from queue
const assignNurse = async (req, res) => {
  const shift = await Shift.findById(req.params.id);
  if (!shift) return res.status(404).json({ message: "Shift not found" });

  const nextNurse = req.body.nurseId || shift.nursesApplied[0];
  if (!nextNurse) return res.status(400).json({ message: "No nurse in queue" });

  shift.nurseAssigned = nextNurse;
  await shift.save();
  res.json(shift);
};

// Cancel assignment and auto-assign next
const cancelAssignment = async (req, res) => {
  const shift = await Shift.findById(req.params.id);
  if (!shift) return res.status(404).json({ message: "Shift not found" });

  const index = shift.nursesApplied.indexOf(shift.nurseAssigned);
  if (index > -1) shift.nursesApplied.splice(index, 1);

  shift.nurseAssigned = shift.nursesApplied[0] || null;
  await shift.save();
  res.json(shift);
};

// View queue for shift
const viewQueue = async (req, res) => {
  const shift = await Shift.findById(req.params.id).populate("nursesApplied", "name email");
  if (!shift) return res.status(404).json({ message: "Shift not found" });
  res.json(shift.nursesApplied);
};

module.exports = { createShift, listShifts, getShift, updateShift, cancelShift, applyShift, assignNurse, cancelAssignment, viewQueue };
