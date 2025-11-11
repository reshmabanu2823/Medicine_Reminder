import React, { useState } from 'react';
import axios from 'axios';

const ReminderModal = ({ medicine, onClose, onSuccess }) => {
  const [reminderForm, setReminderForm] = useState({
    time: '',
    frequency: 'daily',
    enabled: true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/reminders', {
        medicineId: medicine._id,
        ...reminderForm
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating reminder:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Schedule Reminder</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div style={{ marginBottom: '20px', padding: '15px', background: 'var(--light-gray)', borderRadius: '8px' }}>
          <strong>Medicine:</strong> {medicine.name} - {medicine.dosage}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Reminder Time:
            </label>
            <input
              type="time"
              value={reminderForm.time}
              onChange={(e) => setReminderForm({...reminderForm, time: e.target.value})}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Frequency:
            </label>
            <select
              value={reminderForm.frequency}
              onChange={(e) => setReminderForm({...reminderForm, frequency: e.target.value})}
              className="form-input"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="as-needed">As Needed</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="premium-btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="premium-btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderModal;