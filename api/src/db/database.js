import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// fileURLToPath converts that URL into a standard filesystem path.
const __filename = fileURLToPath(import.meta.url);
// Extract the directory containing this file.
const __dirname = path.dirname(__filename);

// Absolute path to the SQLite database file.
const dbPath = path.resolve(__dirname, 'tasks.sqlite');

// Create or open the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to the database', err);
    return;
  }

  console.log('Database connected');
});

export default db;
