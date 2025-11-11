const express = require('express');
const Medicine = require('../models/Medicine');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all medicines for user
router.get('/', auth, async (req, res) => {
  try {
    const medicines = await Medicine.find({ user: req.user._id });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add medicine
router.post('/', auth, async (req, res) => {
  try {
    const medicine = new Medicine({
      ...req.body,
      user: req.user._id
    });
    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update medicine
router.put('/:id', auth, async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete medicine
router.delete('/:id', auth, async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json({ message: 'Medicine deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;