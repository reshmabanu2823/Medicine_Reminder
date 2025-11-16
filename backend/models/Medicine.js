const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  time: { type: String, default: '08:00' },
  frequency: { type: String, required: true },
  stockCount: { type: Number, default: 0 },
  expiryDate: { type: Date, required: true },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);