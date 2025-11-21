const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  
  // Scheduling
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  duration: { type: Number }, // in hours
  
  // Requirements
  department: { 
    type: String, 
    enum: ["ICU", "ER", "Pediatrics", "Surgery", "Oncology", "Cardiology", "Neurology", "General", "Mental Health", "Geriatrics"],
    required: true 
  },
  requiredSpecializations: [{ type: String }],
  requiredCertifications: [{ type: String }],
  minimumExperience: { type: Number, default: 0 },
  urgencyLevel: { 
    type: String, 
    enum: ["low", "medium", "high", "emergency"], 
    default: "medium" 
  },
  
  // Payment
  paymentRate: { type: Number, required: true, min: 0 },
  paymentType: { type: String, enum: ["hourly", "flat"], default: "hourly" },
  bonusAmount: { type: Number, default: 0 },
  totalPayment: { type: Number },
  
  // Status and Assignment
  status: { 
    type: String, 
    enum: ["open", "assigned", "in-progress", "completed", "cancelled"], 
    default: "open" 
  },
  nursesApplied: [{
    nurse: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    appliedAt: { type: Date, default: Date.now },
    message: { type: String }
  }],
  nurseAssigned: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedAt: { type: Date },
  
  // Surge and Priority
  surge: { type: Boolean, default: false },
  surgeMultiplier: { type: Number, default: 1.0 },
  priority: { type: Number, default: 1, min: 1, max: 10 },
  
  // Completion
  completedAt: { type: Date },
  cancelledAt: { type: Date },
  cancellationReason: { type: String },
  
  // Notes
  hospitalNotes: { type: String },
  nurseNotes: { type: String },
  
  // Location (if different from hospital)
  shiftLocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number] },
    address: { type: String }
  }
}, {
  timestamps: true
});

const Shift = mongoose.model("Shift", shiftSchema);
module.exports = Shift;
