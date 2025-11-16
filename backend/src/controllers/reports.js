const { db } = require('../db');

function adherenceReport(req, res) {
  const user_id = req.user.id;
  // last 7 days adherence: % of scheduled reminders taken
  // This is a simplified approach: take total 'taken' count vs total reminders in history for the last 7 days
  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
  const total = db.prepare('SELECT COUNT(*) as c FROM history WHERE user_id = ? AND time > ?').get(user_id, weekAgo).c;
  const taken = db.prepare("SELECT COUNT(*) as c FROM history WHERE user_id = ? AND time > ? AND action = 'taken'").get(user_id, weekAgo).c;
  const percent = total === 0 ? 0 : Math.round((taken / total) * 100);
  res.json({ ok: true, weeklyAdherence: percent });
}

function calendar(req, res) {
  const user_id = req.user.id;
  const items = db.prepare('SELECT * FROM history WHERE user_id = ? ORDER BY time DESC LIMIT 200').all(user_id);
  res.json({ ok: true, calendar: items });
}

module.exports = { adherenceReport, calendar };
