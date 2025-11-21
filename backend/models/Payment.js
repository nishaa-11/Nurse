const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  shift: { type: mongoose.Schema.Types.ObjectId, ref: "Shift", required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nurse: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // Payment Details
  baseAmount: { type: Number, required: true, min: 0 },
  surgeAmount: { type: Number, default: 0 },
  bonusAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  
  // Platform fee
  platformFee: { type: Number, default: 0 },
  platformFeePercentage: { type: Number, default: 0.05 }, // 5% default
  
  // Status
  status: { 
    type: String, 
    enum: ["pending", "processing", "completed", "failed", "refunded"], 
    default: "pending" 
  },
  
  // Payment method
  paymentMethod: {
    type: String,
    enum: ["credit_card", "bank_transfer", "paypal", "stripe", "cash"],
    default: "stripe"
  },
  
  // Transaction details
  transactionId: { type: String },
  externalTransactionId: { type: String }, // Stripe, PayPal, etc.
  
  // Dates
  dueDate: { type: Date },
  paidAt: { type: Date },
  processedAt: { type: Date },
  
  // Notes and metadata
  notes: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  
  // Invoice details
  invoiceNumber: { type: String },
  invoiceUrl: { type: String },
  
  // Failure handling
  failureReason: { type: String },
  retryCount: { type: Number, default: 0 },
  
  // Refund information
  refundAmount: { type: Number, default: 0 },
  refundReason: { type: String },
  refundedAt: { type: Date }
}, {
  timestamps: true
});

// Generate invoice number before saving
paymentSchema.pre("save", function(next) {
  if (!this.invoiceNumber) {
    this.invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  
  // Calculate total amount
  this.totalAmount = this.baseAmount + this.surgeAmount + this.bonusAmount;
  
  next();
});

// Indexes
paymentSchema.index({ hospital: 1, status: 1, createdAt: -1 });
paymentSchema.index({ nurse: 1, status: 1, createdAt: -1 });
paymentSchema.index({ shift: 1 });
paymentSchema.index({ transactionId: 1 });

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;