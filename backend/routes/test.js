const express = require('express');
const router = express.Router();

// Test endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;