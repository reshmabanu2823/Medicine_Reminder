const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '../meditrack.db');
const db = new sqlite3.Database(dbPath);

function init() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      reminder_method TEXT DEFAULT 'email',
      created_at TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS medicines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT,
      type TEXT,
      dosage TEXT,
      frequency TEXT,
      reminder_times TEXT,
      start_date TEXT,
      end_date TEXT,
      notes TEXT,
      qty INTEGER,
      threshold INTEGER DEFAULT 5,
      expiry_date TEXT,
      created_at TEXT,
      updated_at TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT,
      body TEXT,
      type TEXT,
      metadata TEXT,
      time TEXT,
      read INTEGER DEFAULT 0
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      medicine_id INTEGER,
      action TEXT,
      time TEXT
    )`);
  });
}

module.exports = { db, init };
