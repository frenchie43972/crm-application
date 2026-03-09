import fs from 'fs/promise';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path to the directory containing migration SQL files.
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
