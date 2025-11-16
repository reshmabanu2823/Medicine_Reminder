import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

const AddMedicine = () => {
  const [formData, setFormData] = useState({
    name: '', dosage: '', time: '08:00', frequency: '', stockCount: 0, expiryDate: '', notes: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/medicines', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/stock-overview');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add medicine');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Add New Medicine</h2>
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="medicine-form">
          <input
            type="text"
            placeholder="Medicine Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Dosage (e.g., 500mg)"
            value={formData.dosage}
            onChange={(e) => setFormData({...formData, dosage: e.target.value})}
            required
          />
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
          />
          <select
            value={formData.frequency}
            onChange={(e) => setFormData({...formData, frequency: e.target.value})}
            required
          >
            <option value="">Select Frequency</option>
            <option value="Once daily">Once daily</option>
            <option value="Twice daily">Twice daily</option>
            <option value="Three times daily">Three times daily</option>
            <option value="As needed">As needed</option>
          </select>
          <input
            type="number"
            placeholder="Stock Count"
            value={formData.stockCount}
            onChange={(e) => setFormData({...formData, stockCount: e.target.value})}
            min="0"
          />
          <input
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
            required
          />
          <textarea
            placeholder="Notes (optional)"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows="3"
          />
          <button type="submit" className="btn btn-primary">Add Medicine</button>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;