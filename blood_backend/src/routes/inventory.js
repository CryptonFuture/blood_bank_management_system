const express = require('express');
const axios = require('axios');
const BloodUnit = require('../models/BloodUnit');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Get all inventory
router.get('/', protect, async (req, res) => {
  try {
    let inventory = await BloodUnit.find().sort({ bloodGroup: 1 });

    // Ensure all groups exist
    if (inventory.length < 8) {
      for (const bg of BLOOD_GROUPS) {
        const exists = inventory.find(i => i.bloodGroup === bg);
        if (!exists) {
          await BloodUnit.create({ bloodGroup: bg, units: 0 });
        }
      }
      inventory = await BloodUnit.find().sort({ bloodGroup: 1 });
    }

    // Call Python for analytics if available
    let analytics = null;
    try {
      const pyRes = await axios.post(
        `${process.env.PYTHON_SERVICE_URL || 'http://localhost:8000'}/analytics`,
        { inventory: inventory.map(i => ({ bloodGroup: i.bloodGroup, units: i.units })) },
        { timeout: 3000 }
      );
      analytics = pyRes.data;
    } catch (e) {
      // fallback
    }

    res.json({ inventory, analytics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single blood group
router.get('/:bloodGroup', protect, async (req, res) => {
  try {
    const unit = await BloodUnit.findOne({ bloodGroup: req.params.bloodGroup });
    if (!unit) return res.status(404).json({ message: 'Blood group not found' });
    res.json(unit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Manual stock adjustment (admin/staff)
router.put('/:bloodGroup', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { units, operation } = req.body; // operation: set | add | subtract
    let unit = await BloodUnit.findOne({ bloodGroup: req.params.bloodGroup });
    if (!unit) {
      unit = await BloodUnit.create({ bloodGroup: req.params.bloodGroup, units: 0 });
    }

    if (operation === 'set') unit.units = Math.max(0, units);
    else if (operation === 'add') unit.units += units;
    else if (operation === 'subtract') unit.units = Math.max(0, unit.units - units);
    else unit.units = Math.max(0, units);

    unit.lastUpdated = new Date();
    await unit.save();
    res.json(unit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
