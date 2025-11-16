const cron = require('node-cron');
const { db } = require('./db');

function start() {
  // every minute check upcoming reminders and low stock
  cron.schedule('* * * * *', () => {
    try {
      // upcoming reminders in next 60 minutes
      // This is a simplified example — real timing should consider reminders times and user's timezone
      const now = new Date();
      const items = db.prepare('SELECT * FROM medicines').all();
      items.forEach(item => {
        if (item.qty < (item.threshold || 5)) {
          // check if low stock alert already exists for today
          const exists = db.prepare('SELECT * FROM notifications WHERE user_id = ? AND type = ? AND date(time) = date(?)').get(item.user_id, 'low_stock', new Date().toISOString());
          if (!exists) {
            db.prepare('INSERT INTO notifications (user_id,title,body,type,time) VALUES (?,?,?,?,?)')
              .run(item.user_id, `Low stock: ${item.name}`, `Current stock is ${item.qty}`, 'low_stock', new Date().toISOString());
          }
        }
      });
    } catch (e) {
      console.warn('Scheduler error', e);
    }
  });
}

module.exports = { start };
