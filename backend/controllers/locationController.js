const User = require("../models/User");

// Nurse updates location
const updateLocation = async (req, res) => {
  const { coordinates } = req.body; // [lng, lat]
  if (!coordinates) return res.status(400).json({ message: "Provide coordinates" });

  req.user.location.coordinates = coordinates;
  await req.user.save();
  res.json(req.user);
};

// Fetch nearby nurses
const getNearbyNurses = async (req, res) => {
  const { lng, lat, distance = 5 } = req.query;
  if (!lng || !lat) return res.status(400).json({ message: "Provide lng and lat" });

  const distanceInMeters = distance * 1000;

  const nurses = await User.find({
    role: "nurse",
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: distanceInMeters,
      },
    },
  }).select("name email location");

  res.json(nurses);
};

module.exports = { updateLocation, getNearbyNurses };
