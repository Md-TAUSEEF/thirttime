const mongoose = require('mongoose');

// Define the schema
const paymentSchema = new mongoose.Schema({
  razorpay_payment_id: {
    type: String,
    required: true,
    maxlength: 50 // Optional: adjust based on expected length
  },
  razorpay_order_id: {
    type: String,
    required: true,
    maxlength: 50 // Optional: adjust based on expected length
  },
  razorpay_signature: {
    type: String,
    required: true,
    maxlength: 128 // Optional: adjust based on expected length
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Apply indexes after schema definition
paymentSchema.index({ razorpay_order_id: 1 });
paymentSchema.index({ razorpay_payment_id: 1 });

// Create the model
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
