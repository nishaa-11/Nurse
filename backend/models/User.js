const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  profilePicture: { type: String },
  role: { type: String, enum: ["hospital", "nurse"], required: true },
  
  // Location data
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String, default: "USA" }
  },
  
  // Verification
  verified: { type: Boolean, default: false },
  idDocument: { type: String }, // for verification
  verificationStatus: { 
    type: String, 
    enum: ["pending", "verified", "rejected"], 
    default: "pending" 
  },
  
  // Nurse-specific fields
  nurseProfile: {
    licenseNumber: { type: String },
    experienceYears: { type: Number, min: 0 },
    specializations: [{ 
      type: String, 
      enum: ["ICU", "ER", "Pediatrics", "Surgery", "Oncology", "Cardiology", "Neurology", "General", "Mental Health", "Geriatrics"] 
    }],
    certifications: [{ type: String }],
    hourlyRate: { type: Number, min: 0 },
    availability: {
      monday: { available: Boolean, hours: [String] },
      tuesday: { available: Boolean, hours: [String] },
      wednesday: { available: Boolean, hours: [String] },
      thursday: { available: Boolean, hours: [String] },
      friday: { available: Boolean, hours: [String] },
      saturday: { available: Boolean, hours: [String] },
      sunday: { available: Boolean, hours: [String] }
    },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    completedShifts: { type: Number, default: 0 }
  },
  
  // Hospital-specific fields
  hospitalProfile: {
    hospitalType: { 
      type: String, 
      enum: ["General", "Specialty", "Teaching", "Rehabilitation", "Psychiatric", "Children's"] 
    },
    size: { 
      type: String, 
      enum: ["Small (1-100 beds)", "Medium (101-300 beds)", "Large (301-500 beds)", "Extra Large (500+ beds)"] 
    },
    departments: [{ type: String }],
    contactPerson: {
      name: { type: String },
      title: { type: String },
      phone: { type: String },
      email: { type: String }
    },
    accreditation: [{ type: String }],
    emergencyContact: {
      name: { type: String },
      phone: { type: String }
    }
  },
  
  // Timestamps
  lastActive: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

userSchema.index({ location: "2dsphere" });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
