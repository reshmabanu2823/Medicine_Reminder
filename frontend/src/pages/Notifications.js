import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(notif => 
        notif._id === id ? {...notif, isRead: true} : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications(notifications.map(notif => ({...notif, isRead: true})));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="header">
          <h2>Notifications</h2>
          <button onClick={markAllAsRead}>Mark All as Read</button>
        </div>
        <div className="notifications-list">
          {notifications.map(notification => (
            <div 
              key={notification._id} 
              className={`notification ${notification.isRead ? 'read' : 'unread'}`}
              onClick={() => !notification.isRead && markAsRead(notification._id)}
            >
              <h4>{notification.title}</h4>
              <p>{notification.message}</p>
              <small>{new Date(notification.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;