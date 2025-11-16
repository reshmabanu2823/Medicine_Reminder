<<<<<<< HEAD
  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
=======
# Medicine Reminder Application

A premium healthcare management system built with React and Node.js.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Setup Instructions

1. **Clone and Install Dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

2. **Configure MongoDB Atlas**
   - Create a MongoDB Atlas account at https://mongodb.com/atlas
   - Create a new cluster (free tier available)
   - Add your IP address to Network Access
   - Create a database user
   - Get your connection string

3. **Environment Configuration**
   - Update `backend/.env` file:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string_here
   JWT_SECRET=medicine_reminder_jwt_secret_2024_secure_key
   NODE_ENV=development
   ```

4. **Start the Application**
   
   **Option 1: Use the startup script (Windows)**
   ```bash
   # Double-click start-app.bat or run:
   start-app.bat
   ```
   
   **Option 2: Manual start**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

## 🔧 Troubleshooting

### MongoDB Connection Issues
- **Error**: "Could not connect to any servers in your MongoDB Atlas cluster"
- **Solution**: Add your current IP address to MongoDB Atlas Network Access
  1. Go to MongoDB Atlas Dashboard
  2. Network Access → Add IP Address
  3. Click "Add Current IP Address"

### Port Already in Use
- **Frontend (3000)**: The app will automatically suggest port 3001, 3002, etc.
- **Backend (5000)**: Change PORT in `.env` file

### Security Vulnerabilities (Frontend)
- These are in development dependencies and don't affect production
- Safe to ignore for development
- Run `npm audit fix` (without --force) for safe fixes

## 📱 Features

- **User Authentication**: Secure login/register system
- **Medicine Management**: Add, edit, delete medicines
- **Smart Reminders**: Automated medication reminders
- **Stock Tracking**: Monitor medicine inventory
- **Expiry Alerts**: Get notified before medicines expire
- **Patient Notes**: Keep track of health observations
- **Premium UI**: Modern, responsive design

## 🏗️ Project Structure

```
medicine_reminder/
├── backend/                 # Node.js API server
│   ├── config/             # Database configuration
│   ├── middleware/         # Authentication middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   └── server.js          # Main server file
├── frontend/              # React application
│   ├── public/           # Static files
│   └── src/              # React components
└── start-app.bat         # Windows startup script
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- CORS configuration

## 🌐 API Endpoints

- `GET /api/test/health` - Server health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/medicines` - Get user medicines
- `POST /api/medicines` - Add new medicine
- `GET /api/dashboard` - Dashboard data

## 📞 Support

If you encounter any issues:
1. Check MongoDB Atlas connection
2. Verify IP whitelist in Atlas
3. Ensure all dependencies are installed
4. Check console for error messages

## 🎯 Next Steps

1. Start the application using the instructions above
2. Register a new account or login
3. Add your first medicine
4. Set up reminders
5. Explore the dashboard features

---

**Note**: This application requires an active internet connection for MongoDB Atlas.
>>>>>>> a3538f3108d95fe8e5df2c95cc1d081443f93885
