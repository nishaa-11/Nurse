const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  
  type: { 
    type: String, 
    enum: [
      "shift_assigned", 
      "shift_cancelled", 
      "shift_completed", 
      "application_received", 
      "application_accepted", 
      "application_rejected",
      "payment_processed",
      "rating_received",
      "surge_activated",
      "emergency_shift",
      "verification_approved",
      "verification_rejected"
    ], 
    required: true 
  },
  
  title: { type: String, required: true },
  message: { type: String, required: true },
  
  // Related entities
  shift: { type: mongoose.Schema.Types.ObjectId, ref: "Shift" },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  rating: { type: mongoose.Schema.Types.ObjectId, ref: "Rating" },
  
  // Status
  read: { type: Boolean, default: false },
  readAt: { type: Date },
  
  // Additional data
  data: { type: mongoose.Schema.Types.Mixed },
  
  // Priority and expiry
  priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
  expiresAt: { type: Date }
}, {
  timestamps: true
});

// Index for efficient querying
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;