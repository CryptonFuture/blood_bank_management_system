const express = require('express');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all donors
router.get('/', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const donors = await User.find({ role: 'donor' }).select('-password').sort({ name: 1 });
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search donors by blood group
router.get('/search', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { bloodGroup, city } = req.query;
    const query = { role: 'donor' };
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (city) query.city = new RegExp(city, 'i');

    const donors = await User.find(query).select('-password');
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update eligibility (after 90 days check can be automated)
router.put('/:id/eligibility', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const donor = await User.findByIdAndUpdate(
      req.params.id,
      { isEligible: req.body.isEligible },
      { new: true }
    ).select('-password');
    if (!donor) return res.status(404).json({ message: 'Donor not found' });
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
