const express = require('express');
const Request = require('../models/Request');
const BloodUnit = require('../models/BloodUnit');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Create blood request
router.post('/', protect, async (req, res) => {
  try {
    const {
      bloodGroup, unitsRequested, urgency, patientName, patientAge,
      hospitalName, reason, requiredBy, notes
    } = req.body;

    const request = await Request.create({
      requester: req.user._id,
      bloodGroup,
      unitsRequested,
      urgency: urgency || 'normal',
      patientName,
      patientAge,
      hospitalName: hospitalName || req.user.hospitalName,
      reason,
      requiredBy,
      notes
    });

    const populated = await Request.findById(request._id)
      .populate('requester', 'name email phone hospitalName');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get requests (role based)
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'donor' || req.user.role === 'hospital') {
      query.requester = req.user._id;
    }
    // admin & staff see all

    const requests = await Request.find(query)
      .populate('requester', 'name email phone hospitalName')
      .populate('processedBy', 'name')
      .sort({ urgency: -1, createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single request
router.get('/:id', protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('requester', 'name email phone hospitalName')
      .populate('processedBy', 'name');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Process request (approve / fulfill / reject) - staff/admin
router.put('/:id/process', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { status, unitsToFulfill, notes } = req.body;
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (status === 'rejected' || status === 'cancelled') {
      request.status = status;
      request.processedBy = req.user._id;
      request.processedAt = new Date();
      if (notes) request.notes = (request.notes || '') + ' | ' + notes;
      await request.save();
      return res.json(await Request.findById(request._id).populate('requester', 'name email phone').populate('processedBy', 'name'));
    }

    if (status === 'approved' || status === 'fulfilled' || status === 'partially_fulfilled') {
      const unitsNeeded = unitsToFulfill || request.unitsRequested - request.unitsFulfilled;
      const inventory = await BloodUnit.findOne({ bloodGroup: request.bloodGroup });

      if (!inventory || inventory.units < unitsNeeded) {
        return res.status(400).json({
          message: `Insufficient stock. Available: ${inventory?.units || 0}, Needed: ${unitsNeeded}`
        });
      }

      // Deduct inventory
      inventory.units -= unitsNeeded;
      // Mark bags as used (simple: reduce available bags)
      let remaining = unitsNeeded;
      for (let bag of inventory.bags) {
        if (bag.status === 'available' && remaining > 0) {
          bag.status = 'used';
          remaining--;
        }
      }
      inventory.lastUpdated = new Date();
      await inventory.save();

      request.unitsFulfilled += unitsNeeded;
      if (request.unitsFulfilled >= request.unitsRequested) {
        request.status = 'fulfilled';
      } else {
        request.status = 'partially_fulfilled';
      }
      request.processedBy = req.user._id;
      request.processedAt = new Date();
      if (notes) request.notes = (request.notes || '') + ' | ' + notes;
      await request.save();
    }

    const populated = await Request.findById(request._id)
      .populate('requester', 'name email phone hospitalName')
      .populate('processedBy', 'name');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
