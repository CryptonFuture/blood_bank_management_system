const mongoose = require('mongoose');

const bloodUnitSchema = new mongoose.Schema({
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  units: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  // Individual bag tracking (optional detailed)
  bags: [{
    bagId: String,
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    collectionDate: Date,
    expiryDate: Date,
    status: {
      type: String,
      enum: ['available', 'reserved', 'used', 'expired', 'discarded'],
      default: 'available'
    },
    volume: { type: Number, default: 450 } // ml
  }],
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

bloodUnitSchema.index({ bloodGroup: 1 }, { unique: true });

module.exports = mongoose.model('BloodUnit', bloodUnitSchema);
