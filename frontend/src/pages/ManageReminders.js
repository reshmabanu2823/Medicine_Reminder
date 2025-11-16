import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ManageReminders = () => {
  const { medicineId } = useParams();
  const [reminders, setReminders] = useState([]);
  const [newReminderTime, setNewReminderTime] = useState('');
  const [medicine, setMedicine] = useState(null);

  useEffect(() => {
    fetchReminders();
    fetchMedicine();
  }, [medicineId]);

  const fetchMedicine = async () => {
    try {
      const response = await axios.get(`/api/medicines/${medicineId}`);
      setMedicine(response.data);
    } catch (error) {
      console.error('Error fetching medicine:', error);
    }
  };

  const fetchReminders = async () => {
    try {
      const response = await axios.get('/api/reminders');
      const medicineReminders = response.data.filter(
        reminder => reminder.medicine._id === medicineId
      );
      setReminders(medicineReminders);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const addReminder = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/reminders', {
        medicineId,
        reminderTime: newReminderTime
      });
      setReminders([...reminders, response.data]);
      setNewReminderTime('');
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  };

  const updateReminderStatus = async (reminderId, status) => {
    try {
      const response = await axios.put(`/api/reminders/${reminderId}/status`, { status });
      setReminders(reminders.map(reminder => 
        reminder._id === reminderId ? response.data : reminder
      ));
    } catch (error) {
      console.error('Error updating reminder status:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Manage Reminders</h2>
        {medicine && <h3>Medicine: {medicine.name}</h3>}
        
        <form onSubmit={addReminder}>
          <input
            type="time"
            value={newReminderTime}
            onChange={(e) => setNewReminderTime(e.target.value)}
            required
          />
          <button type="submit">Add Reminder</button>
        </form>

        <div className="reminders-list">
          <h3>Current Reminders</h3>
          {reminders.map(reminder => (
            <div key={reminder._id} className="reminder-item">
              <span>{reminder.reminderTime}</span>
              <span className={`status ${reminder.status.toLowerCase()}`}>
                {reminder.status}
              </span>
              <div>
                <button 
                  onClick={() => updateReminderStatus(reminder._id, 'Taken')}
                  disabled={reminder.status === 'Taken'}
                >
                  Mark as Taken
                </button>
                <button 
                  onClick={() => updateReminderStatus(reminder._id, 'Pending')}
                  disabled={reminder.status === 'Pending'}
                >
                  Mark as Pending
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageReminders;