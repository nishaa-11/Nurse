const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  nurse: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // Regular weekly availability
  weeklySchedule: {
    monday: {
      available: { type: Boolean, default: false },
      timeSlots: [{
        startTime: { type: String }, // "09:00"
        endTime: { type: String },   // "17:00"
        maxShifts: { type: Number, default: 1 }
      }]
    },
    tuesday: {
      available: { type: Boolean, default: false },
      timeSlots: [{
        startTime: { type: String },
        endTime: { type: String },
        maxShifts: { type: Number, default: 1 }
      }]
    },
    wednesday: {
      available: { type: Boolean, default: false },
      timeSlots: [{
        startTime: { type: String },
        endTime: { type: String },
        maxShifts: { type: Number, default: 1 }
      }]
    },
    thursday: {
      available: { type: Boolean, default: false },
      timeSlots: [{
        startTime: { type: String },
        endTime: { type: String },
        maxShifts: { type: Number, default: 1 }
      }]
    },
    friday: {
      available: { type: Boolean, default: false },
      timeSlots: [{
        startTime: { type: String },
        endTime: { type: String },
        maxShifts: { type: Number, default: 1 }
      }]
    },
    saturday: {
      available: { type: Boolean, default: false },
      timeSlots: [{
        startTime: { type: String },
        endTime: { type: String },
        maxShifts: { type: Number, default: 1 }
      }]
    },
    sunday: {
      available: { type: Boolean, default: false },
      timeSlots: [{
        startTime: { type: String },
        endTime: { type: String },
        maxShifts: { type: Number, default: 1 }
      }]
    }
  },
  
  // Specific date overrides
  dateOverrides: [{
    date: { type: Date, required: true },
    available: { type: Boolean, default: false },
    timeSlots: [{
      startTime: { type: String },
      endTime: { type: String },
      maxShifts: { type: Number, default: 1 }
    }],
    reason: { type: String } // "vacation", "sick", "personal", etc.
  }],
  
  // Time off requests
  timeOffRequests: [{
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String },
    approved: { type: Boolean, default: false },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date }
  }],
  
  // Preferences
  preferences: {
    preferredShiftLength: { type: Number, default: 8 }, // hours
    maxShiftsPerWeek: { type: Number, default: 5 },
    maxConsecutiveDays: { type: Number, default: 3 },
    minimumNoticeHours: { type: Number, default: 24 },
    willingToWorkWeekends: { type: Boolean, default: true },
    willingToWorkNights: { type: Boolean, default: true },
    willingToWorkHolidays: { type: Boolean, default: false },
    preferredDepartments: [{ type: String }],
    minimumHourlyRate: { type: Number }
  },
  
  // Current status
  currentStatus: {
    type: String,
    enum: ["available", "busy", "on_shift", "unavailable", "vacation"],
    default: "available"
  },
  
  // Emergency availability
  emergencyAvailable: { type: Boolean, default: false },
  emergencyContactHours: { type: Number, default: 2 }, // hours notice needed
  
  // Auto-accept settings
  autoAccept: {
    enabled: { type: Boolean, default: false },
    maxDistance: { type: Number, default: 25 }, // miles
    minimumRate: { type: Number },
    preferredHospitals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    departments: [{ type: String }]
  }
}, {
  timestamps: true
});

// Indexes
availabilitySchema.index({ nurse: 1 });
availabilitySchema.index({ "dateOverrides.date": 1 });
availabilitySchema.index({ currentStatus: 1 });

const Availability = mongoose.model("Availability", availabilitySchema);
module.exports = Availability;