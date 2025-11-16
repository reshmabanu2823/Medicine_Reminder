import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const EditMedicine = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState({
    name: '',
    dosage: '',
    time: '',
    frequency: '',
    stockCount: '',
    expiryDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchMedicine();
  }, [id]);

  const fetchMedicine = async () => {
    try {
      const response = await axios.get(`/api/medicines/${id}`);
      const med = response.data;
      setMedicine({
        ...med,
        expiryDate: med.expiryDate.split('T')[0]
      });
    } catch (error) {
      console.error('Error fetching medicine:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/medicines/${id}`, medicine);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating medicine:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Edit Medicine</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Medicine Name"
            value={medicine.name}
            onChange={(e) => setMedicine({...medicine, name: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Dosage"
            value={medicine.dosage}
            onChange={(e) => setMedicine({...medicine, dosage: e.target.value})}
            required
          />
          <input
            type="time"
            value={medicine.time}
            onChange={(e) => setMedicine({...medicine, time: e.target.value})}
          />
          <input
            type="text"
            placeholder="Frequency"
            value={medicine.frequency}
            onChange={(e) => setMedicine({...medicine, frequency: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Stock Count"
            value={medicine.stockCount}
            onChange={(e) => setMedicine({...medicine, stockCount: e.target.value})}
          />
          <input
            type="date"
            value={medicine.expiryDate}
            onChange={(e) => setMedicine({...medicine, expiryDate: e.target.value})}
            required
          />
          <textarea
            placeholder="Notes"
            value={medicine.notes}
            onChange={(e) => setMedicine({...medicine, notes: e.target.value})}
          />
          <button type="submit">Update Medicine</button>
        </form>
      </div>
    </div>
  );
};

export default EditMedicine;