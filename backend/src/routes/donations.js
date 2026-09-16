const express = require('express');
const Donation = require('../models/Donation');
const BloodUnit = require('../models/BloodUnit');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Record a donation
router.post('/', protect, authorize('admin', 'staff', 'donor'), async (req, res) => {
  try {
    const { donorId, bloodGroup, units, volume, hemoglobin, bloodPressure, notes } = req.body;

    const donor = await User.findById(donorId || req.user._id);
    if (!donor) return res.status(404).json({ message: 'Donor not found' });

    // Check eligibility (min 90 days between donations)
    if (donor.lastDonationDate) {
      const daysSince = (Date.now() - new Date(donor.lastDonationDate)) / (1000 * 60 * 60 * 24);
      if (daysSince < 90 && req.user.role === 'donor') {
        return res.status(400).json({ message: `Not eligible yet. Wait ${Math.ceil(90 - daysSince)} more days.` });
      }
    }

    const collectionDate = new Date();
    const expiryDate = new Date(collectionDate);
    expiryDate.setDate(expiryDate.getDate() + 42); // Whole blood ~42 days

    const bagId = `BAG-${Date.now().toString(36).toUpperCase()}`;

    const donation = await Donation.create({
      donor: donor._id,
      bloodGroup: bloodGroup || donor.bloodGroup,
      units: units || 1,
      volume: volume || 450,
      collectionDate,
      expiryDate,
      bagId,
      status: 'stored',
      collectedBy: req.user._id,
      hemoglobin,
      bloodPressure,
      notes
    });

    // Update inventory
    let inventory = await BloodUnit.findOne({ bloodGroup: donation.bloodGroup });
    if (!inventory) {
      inventory = await BloodUnit.create({ bloodGroup: donation.bloodGroup, units: 0, bags: [] });
    }
    inventory.units += donation.units;
    inventory.bags.push({
      bagId,
      donor: donor._id,
      collectionDate,
      expiryDate,
      status: 'available',
      volume: donation.volume
    });
    inventory.lastUpdated = new Date();
    await inventory.save();

    // Update donor
    donor.lastDonationDate = collectionDate;
    donor.isEligible = false;
    if (!donor.bloodGroup) donor.bloodGroup = donation.bloodGroup;
    await donor.save();

    const populated = await Donation.findById(donation._id)
      .populate('donor', 'name email phone bloodGroup')
      .populate('collectedBy', 'name');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all donations
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'donor') query.donor = req.user._id;

    const donations = await Donation.find(query)
      .populate('donor', 'name email phone bloodGroup')
      .populate('collectedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single donation
router.get('/:id', protect, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email phone bloodGroup')
      .populate('collectedBy', 'name');
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
