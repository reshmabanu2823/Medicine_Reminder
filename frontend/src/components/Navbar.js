import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const getInitials = (user) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.username ? user.username[0].toUpperCase() : 'U';
  };



  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          {/* Title Section */}
          <div className="navbar-header">
            <Link to="/dashboard" className="navbar-brand">
              Medi Tracker
            </Link>
            <div className="user-actions">
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
              <div 
                className="profile-icon"
                onClick={() => navigate('/profile')}
                title="Profile"
              >
                {getInitials(user)}
              </div>
            </div>
          </div>
          
          {/* Navigation Section */}
          <div className="navbar-nav">
            <div className="nav-items">
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/add-medicine" 
                className={`nav-link ${isActive('/add-medicine') ? 'active' : ''}`}
              >
                Add Medicine
              </Link>
              <Link 
                to="/stock-overview" 
                className={`nav-link ${isActive('/stock-overview') ? 'active' : ''}`}
              >
                Stock Overview
              </Link>
              <Link 
                to="/notifications" 
                className={`nav-link ${isActive('/notifications') ? 'active' : ''}`}
              >
                Notifications
              </Link>
            </div>
          </div>
        </div>
      </nav>
      

    </>
  );
};

export default Navbar;