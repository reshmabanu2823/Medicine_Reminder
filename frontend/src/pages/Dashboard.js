import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Hide welcome animation after 3 seconds
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default data for demo
      setDashboardData({
        totalMedicines: 12,
        lowStockCount: 3,
        expiredCount: 1,
        totalReminders: 8,
        lowStock: [
          { _id: '1', name: 'Aspirin', stockCount: 2 },
          { _id: '2', name: 'Vitamin D', stockCount: 1 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      
      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-content">
            <h1 className="welcome-title">Welcome back, {user?.firstName || user?.username}!</h1>
            <p className="welcome-subtitle">Your health dashboard is ready</p>
          </div>
        </div>
      )}
      
      <div className="container dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Health Dashboard</h1>
          <p className="dashboard-subtitle">Manage your medications and health reminders</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card medicines">
            <div className="stat-icon">💊</div>
            <div className="stat-content">
              <h3 className="stat-number">{dashboardData?.totalMedicines || 0}</h3>
              <p className="stat-label">Total Medicines</p>
            </div>
          </div>
          
          <div className="stat-card low-stock">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <h3 className="stat-number">{dashboardData?.lowStockCount || 0}</h3>
              <p className="stat-label">Low Stock</p>
            </div>
          </div>
          
          <div className="stat-card expired">
            <div className="stat-icon">🚫</div>
            <div className="stat-content">
              <h3 className="stat-number">{dashboardData?.expiredCount || 0}</h3>
              <p className="stat-label">Expired</p>
            </div>
          </div>
          
          <div className="stat-card reminders">
            <div className="stat-icon">🔔</div>
            <div className="stat-content">
              <h3 className="stat-number">{dashboardData?.totalReminders || 0}</h3>
              <p className="stat-label">Active Reminders</p>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <Link to="/add-medicine" className="action-card primary">
            <div className="action-icon">➕</div>
            <div className="action-content">
              <h3>Add Medicine</h3>
              <p>Add new medication to your list</p>
            </div>
          </Link>
          
          <Link to="/stock-overview" className="action-card secondary">
            <div className="action-icon">📊</div>
            <div className="action-content">
              <h3>Stock Overview</h3>
              <p>Monitor your medication inventory</p>
            </div>
          </Link>
          
          <Link to="/notifications" className="action-card tertiary">
            <div className="action-icon">🔔</div>
            <div className="action-content">
              <h3>Notifications</h3>
              <p>View all your health alerts</p>
            </div>
          </Link>
        </div>

        {dashboardData?.lowStock?.length > 0 && (
          <div className="alerts-section">
            <h3 className="section-title">⚠️ Low Stock Alerts</h3>
            <div className="alerts-grid">
              {dashboardData.lowStock.map(medicine => (
                <div key={medicine._id} className="alert-card">
                  <div className="alert-content">
                    <h4>{medicine.name}</h4>
                    <p>Only {medicine.stockCount} left</p>
                  </div>
                  <div className="alert-action">
                    <Link to={`/edit-medicine/${medicine._id}`} className="btn-small btn-primary">
                      Restock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;