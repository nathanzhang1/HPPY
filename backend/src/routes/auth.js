const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const SALT_ROUNDS = 12;

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and password are required' });
    }

    // Normalize phone number (remove non-digits)
    const normalizedPhone = phone.replace(/\D/g, '');

    if (normalizedPhone.length < 10 || normalizedPhone.length > 11) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE phone = ?').get(normalizedPhone);
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this phone number already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user
    const result = db.prepare(
      'INSERT INTO users (phone, password_hash) VALUES (?, ?)'
    ).run(normalizedPhone, passwordHash);

    // Generate JWT
    const token = jwt.sign(
      { userId: result.lastInsertRowid, phone: normalizedPhone },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: result.lastInsertRowid, phone: normalizedPhone }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and password are required' });
    }

    const normalizedPhone = phone.replace(/\D/g, '');

    // Find user
    const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(normalizedPhone);
    if (!user) {
      return res.status(401).json({ error: 'Invalid phone number or password' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid phone number or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, phone: user.phone }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user (protected route)
router.get('/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, phone, created_at FROM users WHERE id = ?').get(req.user.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user });
});

module.exports = router;
