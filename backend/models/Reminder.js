const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  reminderTime: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Taken'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);