const User = require("../models/User");

// List nurses with optional filters
const listNurses = async (req, res) => {
  const { verified } = req.query;
  let filter = { role: "nurse" };
  if (verified) filter.verified = verified === "true";
  const nurses = await User.find(filter).select("-password");
  res.json(nurses);
};

const getNurse = async (req, res) => {
  const nurse = await User.findById(req.params.id).select("-password");
  if (!nurse) return res.status(404).json({ message: "Nurse not found" });
  res.json(nurse);
};

const updateNurse = async (req, res) => {
  const nurse = await User.findById(req.params.id);
  if (!nurse) return res.status(404).json({ message: "Nurse not found" });

  Object.assign(nurse, req.body);
  await nurse.save();
  res.json(nurse);
};

const verifyNurse = async (req, res) => {
  const nurse = await User.findById(req.params.id);
  if (!nurse) return res.status(404).json({ message: "Nurse not found" });
  nurse.verified = true;
  nurse.idDocument = req.body.idDocument || nurse.idDocument;
  await nurse.save();
  res.json(nurse);
};

module.exports = { listNurses, getNurse, updateNurse, verifyNurse };
