const { db } = require('../db');

function listNotifications(req, res) {
  const user_id = req.user.id;
  const items = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY time DESC').all(user_id);
  res.json({ ok: true, notifications: items });
}

function markDone(req, res) {
  const user_id = req.user.id;
  const id = req.params.id;
  db.prepare('UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?').run(id, user_id);
  res.json({ ok: true });
}

function deleteNotification(req, res) {
  const user_id = req.user.id;
  const id = req.params.id;
  db.prepare('DELETE FROM notifications WHERE id = ? AND user_id = ?').run(id, user_id);
  res.json({ ok: true });
}

module.exports = { listNotifications, markDone, deleteNotification };
