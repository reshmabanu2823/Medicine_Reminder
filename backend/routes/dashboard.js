const express = require('express');
const Medicine = require('../models/Medicine');
const Notification = require('../models/Notification');
const Reminder = require('../models/Reminder');
const PatientNotes = require('../models/PatientNotes');
const auth = require('../middleware/auth');

const router = express.Router();

// Get dashboard data
router.get('/', auth, async (req, res) => {
  try {
    const medicines = await Medicine.find({ user: req.user._id });
    const lowStock = medicines.filter(med => med.stockCount <= 5);
    const expired = medicines.filter(med => new Date(med.expiryDate) < new Date());
    const notifications = await Notification.find({ 
      user: req.user._id, 
      isRead: false 
    }).sort({ createdAt: -1 }).limit(5);

    const totalReminders = await Reminder.countDocuments({
      medicine: { $in: medicines.map(med => med._id) }
    });

    res.json({
      medicines,
      lowStockCount: lowStock.length,
      expiredCount: expired.length,
      notifications,
      totalMedicines: medicines.length,
      totalReminders,
      lowStock
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get/Create patient notes
router.get('/notes', auth, async (req, res) => {
  try {
    let notes = await PatientNotes.findOne({ user: req.user._id });
    if (!notes) {
      notes = new PatientNotes({ user: req.user._id, notes: '' });
      await notes.save();
    }
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save patient notes
router.post('/notes', auth, async (req, res) => {
  try {
    const { notes } = req.body;
    let patientNotes = await PatientNotes.findOne({ user: req.user._id });
    
    if (!patientNotes) {
      patientNotes = new PatientNotes({ user: req.user._id, notes });
    } else {
      patientNotes.notes = notes;
    }
    
    await patientNotes.save();
    res.json({ message: 'Notes saved successfully', notes: patientNotes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;