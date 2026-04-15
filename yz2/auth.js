import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function comparePasswords(password, hash) {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function registerUser(username, email, password) {
  const db = getDatabase();
  const passwordHash = await hashPassword(password);

  try {
    const result = await db.run(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );
    return { id: result.lastID, username, email };
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Username or email already exists');
    }
    throw error;
  }
}

export async function loginUser(email, password) {
  const db = getDatabase();
  const user = await db.get(
    'SELECT id, username, email, password_hash FROM users WHERE email = ?',
    [email]
  );

  if (!user) {
    throw new Error('User not found');
  }

  const isValid = await comparePasswords(password, user.password_hash);
  if (!isValid) {
    throw new Error('Invalid password');
  }

  return { id: user.id, username: user.username, email: user.email };
}

export async function getUserById(userId) {
  const db = getDatabase();
  return db.get(
    'SELECT id, username, email FROM users WHERE id = ?',
    [userId]
  );
}
