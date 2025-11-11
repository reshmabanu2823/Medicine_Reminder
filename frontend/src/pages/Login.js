import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      setShowToast(true);
      setTimeout(() => navigate('/dashboard'), 1000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>Medi Tracker</h1>
          <p>Premium Healthcare Management</p>
        </div>
        
        {error && <div className="message message-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="form-input"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="premium-btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="auth-link">
          <p>Don't have an account? <Link to="/register">Create Account</Link></p>
        </div>
      </div>
      
      {showToast && (
        <Toast 
          message="Login successful! Redirecting to dashboard..." 
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default Login;