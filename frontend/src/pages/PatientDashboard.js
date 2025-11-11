import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import ReminderModal from '../components/ReminderModal';
import axios from 'axios';

const PatientDashboard = () => {
  const [medicines, setMedicines] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [medicineForm, setMedicineForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    quantity: ''
  });
  const [reminders, setReminders] = useState([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  useEffect(() => {
    fetchMedicines();
    fetchNotes();
    fetchReminders();
  }, []);

  // Auto-save notes functionality
  const autoSaveNotes = useCallback(async (noteText) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/dashboard/notes', { notes: noteText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAutoSaveStatus('Auto-saved');
      setTimeout(() => setAutoSaveStatus(''), 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, []);

  useEffect(() => {
    if (notes) {
      const timer = setTimeout(() => {
        autoSaveNotes(notes);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [notes, autoSaveNotes]);

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/medicines', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedicines(response.data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/dashboard/notes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(response.data.notes || '');
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/reminders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReminders(response.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const handleAddMedicine = () => {
    setEditingMedicine(null);
    setMedicineForm({ name: '', dosage: '', frequency: '', quantity: '' });
    setShowMedicineModal(true);
  };

  const handleEditMedicine = (medicine) => {
    setEditingMedicine(medicine);
    setMedicineForm({
      name: medicine.name,
      dosage: medicine.dosage,
      frequency: medicine.frequency,
      quantity: medicine.quantity.toString()
    });
    setShowMedicineModal(true);
  };

  const handleDeleteMedicine = async (medicineId) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/medicines/${medicineId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchMedicines();
      } catch (error) {
        console.error('Error deleting medicine:', error);
      }
    }
  };

  const handleMedicineSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const medicineData = {
        ...medicineForm,
        quantity: parseInt(medicineForm.quantity)
      };

      if (editingMedicine) {
        await axios.put(`/api/medicines/${editingMedicine._id}`, medicineData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/medicines', medicineData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      setShowMedicineModal(false);
      fetchMedicines();
    } catch (error) {
      console.error('Error saving medicine:', error);
    }
  };

  const handleScheduleReminder = (medicine) => {
    setSelectedMedicine(medicine);
    setShowReminderModal(true);
  };

  const handleReminderSuccess = () => {
    fetchReminders();
  };

  const getLowStockMedicines = () => {
    return medicines.filter(medicine => medicine.quantity <= 5);
  };

  const MedicineModal = () => (
    <div className="modal-overlay" onClick={() => setShowMedicineModal(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
          </h2>
          <button className="modal-close" onClick={() => setShowMedicineModal(false)}>×</button>
        </div>
        
        <form onSubmit={handleMedicineSubmit}>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="Medicine Name"
                value={medicineForm.name}
                onChange={(e) => setMedicineForm({...medicineForm, name: e.target.value})}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Dosage (e.g., 500mg)"
                value={medicineForm.dosage}
                onChange={(e) => setMedicineForm({...medicineForm, dosage: e.target.value})}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <select
                value={medicineForm.frequency}
                onChange={(e) => setMedicineForm({...medicineForm, frequency: e.target.value})}
                className="form-input"
                required
              >
                <option value="">Select Frequency</option>
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Four times daily">Four times daily</option>
                <option value="As needed">As needed</option>
              </select>
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Quantity"
                value={medicineForm.quantity}
                onChange={(e) => setMedicineForm({...medicineForm, quantity: e.target.value})}
                className="form-input"
                min="1"
                required
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="premium-btn btn-outline" onClick={() => setShowMedicineModal(false)}>
              Cancel
            </button>
            <button type="submit" className="premium-btn btn-primary">
              {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading">
          <div className="spinner"></div>
          Loading dashboard...
        </div>
      </div>
    );
  }

  const lowStockMedicines = getLowStockMedicines();

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Patient Dashboard</h1>
            <p className="dashboard-subtitle">Manage your medications and health notes</p>
          </div>

          {/* Stock Alerts */}
          {lowStockMedicines.length > 0 && (
            <div className="stock-alerts">
              {lowStockMedicines.map(medicine => (
                <div key={medicine._id} className="stock-alert">
                  <span className="alert-icon">⚠️</span>
                  <span>Low stock alert: {medicine.name} has only {medicine.quantity} pills remaining</span>
                </div>
              ))}
            </div>
          )}

          <div className="dashboard-grid">
            {/* Notepad Section */}
            <div className="dashboard-section notepad">
              <div className="section-header">
                <h2 className="section-title">Personal Notes</h2>
                <div className={`auto-save-indicator ${autoSaveStatus ? 'visible' : ''}`}>
                  {autoSaveStatus}
                </div>
              </div>
              <textarea
                className="notepad-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your personal notes here... They will be auto-saved as you type."
              />
            </div>

            {/* Medicine List */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">My Medicines</h2>
                <button className="premium-btn btn-primary" onClick={handleAddMedicine}>
                  Add Medicine
                </button>
              </div>
              
              <div className="medicine-list">
                {medicines.length === 0 ? (
                  <p style={{textAlign: 'center', color: 'var(--dark-silver)', padding: '20px'}}>
                    No medicines added yet. Click "Add Medicine" to get started.
                  </p>
                ) : (
                  medicines.map(medicine => (
                    <div key={medicine._id} className="medicine-item">
                      <div className="medicine-header">
                        <h3 className="medicine-name">{medicine.name}</h3>
                        <div className="medicine-actions">
                          <button 
                            className="btn-small btn-edit"
                            onClick={() => handleScheduleReminder(medicine)}
                          >
                            Schedule
                          </button>
                          <button 
                            className="btn-small btn-edit"
                            onClick={() => handleEditMedicine(medicine)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn-small btn-delete"
                            onClick={() => handleDeleteMedicine(medicine._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="medicine-details">
                        <div className="medicine-detail">
                          <span className="detail-label">Dosage:</span>
                          <span>{medicine.dosage}</span>
                        </div>
                        <div className="medicine-detail">
                          <span className="detail-label">Frequency:</span>
                          <span>{medicine.frequency}</span>
                        </div>
                        <div className="medicine-detail">
                          <span className="detail-label">Stock:</span>
                          <span style={{color: medicine.quantity <= 5 ? 'var(--accent-red)' : 'inherit'}}>
                            {medicine.quantity} pills
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Stock Tracker */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">Stock Overview</h2>
              </div>
              
              <div className="stock-summary">
                <div className="stock-stat">
                  <span className="stat-number">{medicines.length}</span>
                  <span className="stat-label">Total Medicines</span>
                </div>
                <div className="stock-stat">
                  <span className="stat-number" style={{color: lowStockMedicines.length > 0 ? 'var(--accent-red)' : 'var(--primary-gold)'}}>
                    {lowStockMedicines.length}
                  </span>
                  <span className="stat-label">Low Stock Alerts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMedicineModal && <MedicineModal />}
      {showReminderModal && selectedMedicine && (
        <ReminderModal 
          medicine={selectedMedicine}
          onClose={() => setShowReminderModal(false)}
          onSuccess={handleReminderSuccess}
        />
      )}
    </div>
  );
};

export default PatientDashboard;