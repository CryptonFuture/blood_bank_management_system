const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  units: { type: Number, default: 1 },
  volume: { type: Number, default: 450 }, // ml
  collectionDate: { type: Date, default: Date.now },
  expiryDate: Date,
  bagId: String,
  status: {
    type: String,
    enum: ['collected', 'tested', 'stored', 'used', 'discarded'],
    default: 'collected'
  },
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String,
  hemoglobin: Number,
  bloodPressure: String
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
