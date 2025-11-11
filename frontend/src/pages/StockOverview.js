import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

const StockOverview = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicines();
  }, []);

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

  const deleteMedicine = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/medicines/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchMedicines();
      } catch (error) {
        console.error('Error deleting medicine:', error);
      }
    }
  };

  const getStockStatus = (count) => {
    if (count === 0) return 'out-of-stock';
    if (count <= 5) return 'low-stock';
    return 'in-stock';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h2>Stock Overview</h2>
          <Link to="/add-medicine" className="btn btn-primary">Add Medicine</Link>
        </div>

        <div className="medicines-grid">
          {medicines.map(medicine => (
            <div key={medicine._id} className="medicine-card">
              <h3>{medicine.name}</h3>
              <p><strong>Dosage:</strong> {medicine.dosage}</p>
              <p><strong>Frequency:</strong> {medicine.frequency}</p>
              <p><strong>Time:</strong> {medicine.time}</p>
              <p className={`stock-count ${getStockStatus(medicine.stockCount)}`}>
                <strong>Stock:</strong> {medicine.stockCount}
              </p>
              <p><strong>Expires:</strong> {new Date(medicine.expiryDate).toLocaleDateString()}</p>
              {medicine.notes && <p><strong>Notes:</strong> {medicine.notes}</p>}
              
              <div className="medicine-actions">
                <Link to={`/edit-medicine/${medicine._id}`} className="btn btn-secondary">Edit</Link>
                <button 
                  onClick={() => deleteMedicine(medicine._id)} 
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {medicines.length === 0 && (
          <div className="empty-state">
            <p>No medicines added yet.</p>
            <Link to="/add-medicine" className="btn btn-primary">Add Your First Medicine</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockOverview;