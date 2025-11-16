const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../db');
const { sendResetEmail } = require('../utils/mail');

function createUser(req, res) {
  const { name, email, password, reminder_method = 'email' } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const exists = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (exists) return res.status(409).json({ error: 'Email already in use' });
  const hashed = bcrypt.hashSync(password, 10);
  const stmt = db.prepare('INSERT INTO users (name,email,password,reminder_method,created_at) VALUES (?,?,?,?,?)');
  const now = new Date().toISOString();
  const info = stmt.run(name, email, hashed, reminder_method, now);
  const user = db.prepare('SELECT id,name,email,reminder_method,created_at FROM users WHERE id = ?').get(info.lastInsertRowid);
  res.json({ ok: true, user });
}

function login(req, res) {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = bcrypt.compareSync(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  const profile = { id: user.id, name: user.name, email: user.email, reminder_method: user.reminder_method };
  res.json({ ok: true, token, profile });
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.json({ ok: true, message: 'If a user exists with this email, a reset link has been sent.' });
  // generate reset token
  const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  const resetLink = `${process.env.APP_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  await sendResetEmail(email, resetLink);
  res.json({ ok: true, message: 'If a user exists with this email, a reset link has been sent.' });
}

function resetPassword(req, res) {
  const { token, newPassword } = req.body;
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const hashed = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, data.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { createUser, login, forgotPassword, resetPassword };
