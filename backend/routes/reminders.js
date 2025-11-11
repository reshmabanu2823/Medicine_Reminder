const express = require('express');
const Reminder = require('../models/Reminder');
const auth = require('../middleware/auth');

const router = express.Router();

// Get reminders for a medicine
router.get('/:medicineId', auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ medicine: req.params.medicineId });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add reminder
router.post('/', auth, async (req, res) => {
  try {
    const reminder = new Reminder(req.body);
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete reminder
router.delete('/:id', auth, async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reminder deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;