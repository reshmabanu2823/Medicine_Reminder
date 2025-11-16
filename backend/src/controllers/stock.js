const { db } = require('../db');

function updateStock(req, res) {
  const user_id = req.user.id;
  const id = parseInt(req.params.id);
  const { delta, qty, expiry_date } = req.body;
  const med = db.prepare('SELECT * FROM medicines WHERE id = ? AND user_id = ?').get(id, user_id);
  if (!med) return res.status(404).json({ error: 'Not found' });
  let newQty = med.qty;
  if (typeof delta === 'number') newQty = med.qty + delta;
  if (typeof qty === 'number') newQty = qty;
  db.prepare('UPDATE medicines SET qty = ?, expiry_date = ?, updated_at = ? WHERE id = ?').run(newQty, expiry_date || med.expiry_date, new Date().toISOString(), id);
  res.json({ ok: true, qty: newQty });
}

module.exports = { updateStock };
