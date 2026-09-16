const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  unitsRequested: { type: Number, required: true, min: 1 },
  unitsFulfilled: { type: Number, default: 0 },
  urgency: {
    type: String,
    enum: ['normal', 'urgent', 'critical'],
    default: 'normal'
  },
  patientName: String,
  patientAge: Number,
  hospitalName: String,
  reason: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'partially_fulfilled', 'fulfilled', 'rejected', 'cancelled'],
    default: 'pending'
  },
  requiredBy: Date,
  notes: String,
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  processedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
