const mongoose = require("mongoose");

const emergencyRequestSchema = new mongoose.Schema({
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // Emergency details
  urgencyLevel: { 
    type: String, 
    enum: ["critical", "high", "medium"], 
    default: "high" 
  },
  
  situation: { type: String, required: true },
  estimatedDuration: { type: Number }, // hours
  
  // Shift requirements
  department: { 
    type: String, 
    enum: ["ICU", "ER", "Pediatrics", "Surgery", "Oncology", "Cardiology", "Neurology", "General", "Mental Health", "Geriatrics"],
    required: true 
  },
  
  requiredSpecializations: [{ type: String }],
  requiredCertifications: [{ type: String }],
  minimumExperience: { type: Number, default: 0 },
  
  nursesNeeded: { type: Number, default: 1, min: 1 },
  
  // Timing
  neededBy: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String },
  
  // Compensation
  emergencyRate: { type: Number, required: true },
  bonusAmount: { type: Number, default: 0 },
  
  // Response tracking
  nursesNotified: [{
    nurse: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notifiedAt: { type: Date, default: Date.now },
    responded: { type: Boolean, default: false },
    response: { type: String, enum: ["accepted", "declined"] },
    respondedAt: { type: Date },
    estimatedArrival: { type: Date }
  }],
  
  nursesAccepted: [{
    nurse: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    acceptedAt: { type: Date, default: Date.now },
    estimatedArrival: { type: Date },
    actualArrival: { type: Date },
    status: { type: String, enum: ["accepted", "en_route", "arrived", "cancelled"], default: "accepted" }
  }],
  
  // Status
  status: { 
    type: String, 
    enum: ["active", "fulfilled", "cancelled", "expired"], 
    default: "active" 
  },
  
  fulfilledAt: { type: Date },
  cancelledAt: { type: Date },
  cancellationReason: { type: String },
  
  // Location (if different from hospital)
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number] },
    address: { type: String }
  },
  
  // Communication
  contactPerson: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    title: { type: String }
  },
  
  additionalNotes: { type: String },
  
  // Metrics
  responseTime: { type: Number }, // minutes to first acceptance
  fulfillmentTime: { type: Number }, // minutes to full staffing
  
  // Auto-expiry
  expiresAt: { type: Date, required: true }
}, {
  timestamps: true
});

// Auto-expire emergency requests
emergencyRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Other indexes
emergencyRequestSchema.index({ hospital: 1, status: 1, createdAt: -1 });
emergencyRequestSchema.index({ urgencyLevel: 1, status: 1 });
emergencyRequestSchema.index({ department: 1, status: 1 });

// Set expiry date before saving
emergencyRequestSchema.pre("save", function(next) {
  if (!this.expiresAt) {
    // Emergency requests expire after 24 hours by default
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  next();
});

const EmergencyRequest = mongoose.model("EmergencyRequest", emergencyRequestSchema);
module.exports = EmergencyRequest;