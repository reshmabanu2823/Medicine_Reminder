const { db } = require('../db');

function markTaken(req, res) {
  const user_id = req.user.id;
  const id = parseInt(req.params.id);
  const now = new Date().toISOString();
  db.prepare('INSERT INTO history (user_id, medicine_id, action, time) VALUES (?,?,?,?)').run(user_id, id, 'taken', now);
  res.json({ ok: true });
}

function markSkipped(req, res) {
  const user_id = req.user.id;
  const id = parseInt(req.params.id);
  const now = new Date().toISOString();
  db.prepare('INSERT INTO history (user_id, medicine_id, action, time) VALUES (?,?,?,?)').run(user_id, id, 'skipped', now);
  res.json({ ok: true });
}

function snooze(req, res) {
  const user_id = req.user.id;
  const id = parseInt(req.params.id);
  const { minutes = 10 } = req.body;
  // simple snooze: add a notification for later
  const time = new Date(Date.now() + minutes * 60000).toISOString();
  db.prepare('INSERT INTO notifications (user_id,title,body,type,time) VALUES (?,?,?,?,?)')
    .run(user_id, 'Snoozed reminder', `Reminder for medicine id ${id} after ${minutes} minutes`, 'snooze', time);
  res.json({ ok: true });
}

module.exports = { markTaken, markSkipped, snooze };
