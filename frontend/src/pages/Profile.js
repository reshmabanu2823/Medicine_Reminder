import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const getInitials = (user) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.username ? user.username[0].toUpperCase() : 'U';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-wrapper">
      <div className="container">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">User Profile</h1>
            <p className="dashboard-subtitle">Manage your account information</p>
          </div>

          <div className="premium-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="profile-details">
              <div className="profile-avatar">
                <div className="profile-icon large">
                  {getInitials(user)}
                </div>
              </div>
              
              <div className="profile-info">
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : 'Not provided'
                    }
                  </span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">Username:</span>
                  <span className="info-value">{user?.username}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user?.email}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">User Type:</span>
                  <span className="info-value">{user?.userType}</span>
                </div>
                
                {user?.age && (
                  <div className="info-item">
                    <span className="info-label">Age:</span>
                    <span className="info-value">{user.age}</span>
                  </div>
                )}
                
                <div className="info-item">
                  <span className="info-label">Member Since:</span>
                  <span className="info-value">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                className="premium-btn btn-outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
              <button 
                className="premium-btn btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </button>
              <button 
                className="premium-btn btn-secondary"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;