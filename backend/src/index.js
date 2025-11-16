require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { init } = require('./db');
const authCtrl = require('./controllers/auth');
const medsCtrl = require('./controllers/medicines');
const notesCtrl = require('./controllers/notifications');
const { requireAuth } = require('./middleware/auth');
const scheduler = require('./scheduler');
const reportsCtrl = require('./controllers/reports');
const historyCtrl = require('./controllers/history');
const stockCtrl = require('./controllers/stock');

init();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/auth/signup', authCtrl.createUser);
app.post('/api/auth/login', authCtrl.login);
app.post('/api/auth/forgot-password', authCtrl.forgotPassword);
app.post('/api/auth/reset-password', authCtrl.resetPassword);

// protected
app.get('/api/medicines', requireAuth, medsCtrl.listMedicines);
app.post('/api/medicines', requireAuth, medsCtrl.addMedicine);
app.put('/api/medicines/:id', requireAuth, medsCtrl.updateMedicine);
app.post('/api/medicines/:id/take', requireAuth, historyCtrl.markTaken);
app.post('/api/medicines/:id/skip', requireAuth, historyCtrl.markSkipped);
app.post('/api/medicines/:id/snooze', requireAuth, historyCtrl.snooze);

app.get('/api/notifications', requireAuth, notesCtrl.listNotifications);
app.put('/api/notifications/:id/done', requireAuth, notesCtrl.markDone);
app.put('/api/medicines/:id/stock', requireAuth, stockCtrl.updateStock);
app.delete('/api/notifications/:id', requireAuth, notesCtrl.deleteNotification);

app.get('/api/reports/adherence', requireAuth, reportsCtrl.adherenceReport);
app.get('/api/reports/calendar', requireAuth, reportsCtrl.calendar);

// profile
app.get('/api/profile', requireAuth, (req, res) => res.json({ ok: true, profile: req.user }));
app.put('/api/profile', requireAuth, (req, res) => {
  const { name, email, reminder_method } = req.body;
  const stmt = require('./db').db.prepare('UPDATE users SET name=?,email=?,reminder_method=? WHERE id=?');
  stmt.run(name, email, reminder_method, req.user.id);
  const user = require('./db').db.prepare('SELECT id,name,email,reminder_method FROM users WHERE id=?').get(req.user.id);
  res.json({ ok: true, profile: user });
});

// Start scheduler
scheduler.start();

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Backend listening on', port));
