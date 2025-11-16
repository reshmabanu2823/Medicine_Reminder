const mongoose = require('mongoose');

const patientNotesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('PatientNotes', patientNotesSchema);