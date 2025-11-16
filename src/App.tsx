import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './components/Dashboard';
import AddMedicine from './components/AddMedicine';
import StockOverview from './components/StockOverview';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import Reports from './components/Reports';
import Settings from './components/Settings';
import { Toaster } from 'sonner@2.0.3';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Toaster position="top-center" richColors />
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Login onLogin={() => setIsAuthenticated(true)} />
            } 
          />
          <Route 
            path="/signup" 
            element={
              <Signup onSignup={() => setIsAuthenticated(false)} />
            } 
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
              <Dashboard /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/add-medicine" 
            element={
              isAuthenticated ? 
              <AddMedicine /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/edit-medicine/:id" 
            element={
              isAuthenticated ? 
              <AddMedicine /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/stock" 
            element={
              isAuthenticated ? 
              <StockOverview /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/notifications" 
            element={
              isAuthenticated ? 
              <Notifications /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/profile" 
            element={
              isAuthenticated ? 
              <Profile onLogout={() => setIsAuthenticated(false)} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/reports" 
            element={
              isAuthenticated ? 
              <Reports /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/settings" 
            element={
              isAuthenticated ? 
              <Settings /> : 
              <Navigate to="/login" />
            } 
          />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
