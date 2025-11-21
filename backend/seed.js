require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Shift = require("./models/Shift");

const seed = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Shift.deleteMany({});

  // Create sample hospitals
  const hospital1 = await User.create({
    name: "City Hospital",
    email: "hospital1@example.com",
    password: "pass123",
    role: "hospital",
    location: { type: "Point", coordinates: [77.5946, 12.9716] }, // Bangalore example
  });

  const hospital2 = await User.create({
    name: "Green Valley Clinic",
    email: "hospital2@example.com",
    password: "pass123",
    role: "hospital",
    location: { type: "Point", coordinates: [77.6090, 12.9352] },
  });

  // Create sample nurses
  const nurse1 = await User.create({
    name: "Nurse Alice",
    email: "alice@example.com",
    password: "pass123",
    role: "nurse",
    location: { type: "Point", coordinates: [77.6000, 12.9700] },
  });

  const nurse2 = await User.create({
    name: "Nurse Bob",
    email: "bob@example.com",
    password: "pass123",
    role: "nurse",
    location: { type: "Point", coordinates: [77.6100, 12.9650] },
  });

  // Create sample shifts
  await Shift.create({
    title: "Morning Shift - City Hospital",
    hospital: hospital1._id,
    date: new Date(),
    startTime: "08:00",
    endTime: "14:00",
  });

  await Shift.create({
    title: "Evening Shift - Green Valley Clinic",
    hospital: hospital2._id,
    date: new Date(),
    startTime: "15:00",
    endTime: "21:00",
  });

  console.log("Seed data created successfully!");
  mongoose.connection.close();
};

seed();
