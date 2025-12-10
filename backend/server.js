const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/database');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/test', require('./routes/test'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/dashboard', require('./routes/dashboard'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
