const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create activity
router.post('/', (req, res) => {
  try {
    const { name, happiness, created_at } = req.body;
    const userId = req.user.userId;

    if (!name || happiness === undefined) {
      return res.status(400).json({ error: 'Name and happiness are required' });
    }

    if (happiness < 0 || happiness > 100) {
      return res.status(400).json({ error: 'Happiness must be between 0 and 100' });
    }

    // Use client-provided timestamp if available, otherwise use server time
    const timestamp = created_at || new Date().toISOString();

    const result = db.prepare(
      'INSERT INTO activities (user_id, name, happiness, created_at) VALUES (?, ?, ?, ?)'
    ).run(userId, name, happiness, timestamp);

    // Award 10 coins for logging activity
    db.prepare(
      'UPDATE users SET coins = coins + 10 WHERE id = ?'
    ).run(userId);

    const activity = db.prepare(
      'SELECT * FROM activities WHERE id = ?'
    ).get(result.lastInsertRowid);

    const user = db.prepare(
      'SELECT coins FROM users WHERE id = ?'
    ).get(userId);

    res.status(201).json({ 
      activity,
      coins: user.coins
    });
  } catch (err) {
    console.error('Create activity error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all activities for user
router.get('/', (req, res) => {
  try {
    const userId = req.user.userId;

    const activities = db.prepare(
      'SELECT * FROM activities WHERE user_id = ? ORDER BY created_at DESC'
    ).all(userId);

    res.json({ activities });
  } catch (err) {
    console.error('Get activities error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update activity
router.patch('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, happiness } = req.body;
    const userId = req.user.userId;

    // Verify activity belongs to user
    const activity = db.prepare(
      'SELECT * FROM activities WHERE id = ? AND user_id = ?'
    ).get(id, userId);

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    if (happiness !== undefined && (happiness < 0 || happiness > 100)) {
      return res.status(400).json({ error: 'Happiness must be between 0 and 100' });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (happiness !== undefined) {
      updates.push('happiness = ?');
      values.push(happiness);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id, userId);

    db.prepare(
      `UPDATE activities SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`
    ).run(...values);

    const updatedActivity = db.prepare(
      'SELECT * FROM activities WHERE id = ?'
    ).get(id);

    res.json({ activity: updatedActivity });
  } catch (err) {
    console.error('Update activity error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete activity
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = db.prepare(
      'DELETE FROM activities WHERE id = ? AND user_id = ?'
    ).run(id, userId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    res.json({ message: 'Activity deleted successfully' });
  } catch (err) {
    console.error('Delete activity error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
