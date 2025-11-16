const { db } = require('../db');

function addMedicine(req, res) {
  const user_id = req.user.id;
  const { name, type, dosage, frequency, reminder_times, start_date, end_date, notes, qty, expiry_date } = req.body;
  const now = new Date().toISOString();
  const stmt = db.prepare('INSERT INTO medicines (user_id,name,type,dosage,frequency,reminder_times,start_date,end_date,notes,qty,expiry_date,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)');
  const info = stmt.run(user_id, name, type, dosage, frequency, JSON.stringify(reminder_times || []), start_date, end_date, notes, qty || 0, expiry_date, now);
  const med = db.prepare('SELECT * FROM medicines WHERE id = ?').get(info.lastInsertRowid);
  res.json({ ok: true, medicine: med });
}

function updateMedicine(req, res) {
  const user_id = req.user.id;
  const id = req.params.id;
  const existing = db.prepare('SELECT * FROM medicines WHERE id = ? AND user_id = ?').get(id, user_id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const { name, type, dosage, frequency, reminder_times, start_date, end_date, notes, qty, expiry_date } = req.body;
  db.prepare('UPDATE medicines SET name=?,type=?,dosage=?,frequency=?,reminder_times=?,start_date=?,end_date=?,notes=?,qty=?,expiry_date=?,updated_at=? WHERE id=?')
    .run(name, type, dosage, frequency, JSON.stringify(reminder_times || []), start_date, end_date, notes, qty || existing.qty, expiry_date, new Date().toISOString(), id);
  const med = db.prepare('SELECT * FROM medicines WHERE id = ?').get(id);
  res.json({ ok: true, medicine: med });
}

function listMedicines(req, res) {
  const user_id = req.user.id;
  const items = db.prepare('SELECT * FROM medicines WHERE user_id = ? ORDER BY created_at DESC').all(user_id);
  res.json({ ok: true, medicines: items });
}

module.exports = { addMedicine, updateMedicine, listMedicines };
