const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, location, phone, address, nurseProfile, hospitalProfile } = req.body;
    
    console.log('Registration request received:', { name, email, role });
    
    if (!name || !email || !password || !role) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password, role: !!role });
      return res.status(400).json({ message: "All fields required" });
    }

    // Check if MongoDB is connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      // MongoDB not connected, return mock success for testing
      console.log('MongoDB not connected, returning mock user');
      const mockUser = {
        _id: 'mock_' + Date.now(),
        name,
        email,
        role,
        phone,
        address,
        verified: role === "hospital",
        nurseProfile: role === "nurse" ? nurseProfile : undefined,
        hospitalProfile: role === "hospital" ? hospitalProfile : undefined
      };
      
      return res.status(201).json({ 
        ...mockUser,
        token: generateToken(mockUser._id)
      });
    }

    const exists = await User.findOne({ email });
    if (exists) 
        return res.status(400).json({ message: "User exists" });

    // Auto-verify hospital accounts
    const isVerified = role === "hospital" ? true : false;

    const userData = { 
      name, 
      email, 
      password, 
      role, 
      location,
      phone,
      address,
      verified: isVerified
    };

    // Add role-specific profiles
    if (role === "nurse" && nurseProfile) {
      userData.nurseProfile = nurseProfile;
    } else if (role === "hospital" && hospitalProfile) {
      userData.hospitalProfile = hospitalProfile;
    }

    const user = await User.create(userData);

    res.status(201).json({ 
      ...user._doc, 
      token: generateToken(user._id), 
      password: undefined 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || "Registration failed" });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login request received:', email);
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Check if MongoDB is connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      // MongoDB not connected, return mock success for testing
      console.log('MongoDB not connected, returning mock login');
      const mockUser = {
        _id: 'mock_user_' + Date.now(),
        name: 'Test User',
        email,
        role: email.includes('nurse') ? 'nurse' : 'hospital',
        verified: true
      };
      
      return res.json({ 
        ...mockUser,
        token: generateToken(mockUser._id)
      });
    }

    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
      res.json({ ...user._doc, token: generateToken(user._id), password: undefined });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || "Login failed" });
  }
};

const getMe = async (req, res) => res.json(req.user);
const logoutUser = async (req, res) => res.json({ message: "Logged out" });

module.exports = { registerUser, loginUser, getMe, logoutUser };
