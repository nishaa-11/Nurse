const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const registerUser = async (req, res) => {
  const { name, email, password, role, location } = req.body;
  if (!name || !email || !password || !role) 
      return res.status(400).json({ message: "All fields required" });

  const exists = await User.findOne({ email });
  if (exists) 
      return res.status(400).json({ message: "User exists" });

  // Auto-verify hospital accounts
  const isVerified = role === "hospital" ? true : false;

  const user = await User.create({ 
    name, 
    email, 
    password, 
    role, 
    location,
    verified: isVerified
  });

  res.status(201).json({ 
    ...user._doc, 
    token: generateToken(user._id), 
    password: undefined 
  });
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await user.matchPassword(password)) {
    res.json({ ...user._doc, token: generateToken(user._id), password: undefined });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

const getMe = async (req, res) => res.json(req.user);
const logoutUser = async (req, res) => res.json({ message: "Logged out" });

module.exports = { registerUser, loginUser, getMe, logoutUser };
