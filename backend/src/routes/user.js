const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user settings
router.get('/settings', (req, res) => {
  try {
    const userId = req.user.userId;

    const user = db.prepare(
      'SELECT notification_frequency, has_hatched, animals, items FROM users WHERE id = ?'
    ).get(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      notification_frequency: user.notification_frequency,
      has_hatched: Boolean(user.has_hatched),
      animals: JSON.parse(user.animals || '[]'),
      items: JSON.parse(user.items || '[]')
    });
  } catch (err) {
    console.error('Get settings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user settings
router.patch('/settings', (req, res) => {
  try {
    const userId = req.user.userId;
    const { notification_frequency, has_hatched, animals, items } = req.body;

    const updates = [];
    const values = [];

    if (notification_frequency !== undefined) {
      updates.push('notification_frequency = ?');
      values.push(notification_frequency);
    }
    if (has_hatched !== undefined) {
      updates.push('has_hatched = ?');
      values.push(has_hatched ? 1 : 0);
    }
    if (animals !== undefined) {
      updates.push('animals = ?');
      values.push(JSON.stringify(animals));
    }
    if (items !== undefined) {
      updates.push('items = ?');
      values.push(JSON.stringify(items));
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(userId);

    db.prepare(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`
    ).run(...values);

    const updatedUser = db.prepare(
      'SELECT notification_frequency, has_hatched, animals, items FROM users WHERE id = ?'
    ).get(userId);

    res.json({ 
      notification_frequency: updatedUser.notification_frequency,
      has_hatched: Boolean(updatedUser.has_hatched),
      animals: JSON.parse(updatedUser.animals || '[]'),
      items: JSON.parse(updatedUser.items || '[]')
    });
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recommended activities
router.get('/recommended-activities', (req, res) => {
  try {
    const userId = req.user.userId;

    const activities = db.prepare(
      'SELECT activity_name FROM recommended_activities WHERE user_id = ? ORDER BY created_at ASC'
    ).all(userId);

    res.json({ 
      activities: activities.map(a => a.activity_name) 
    });
  } catch (err) {
    console.error('Get recommended activities error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save recommended activities (replaces existing list)
router.post('/recommended-activities', (req, res) => {
  try {
    const userId = req.user.userId;
    const { activities } = req.body;

    if (!Array.isArray(activities)) {
      return res.status(400).json({ error: 'Activities must be an array' });
    }

    // Start transaction
    const deleteStmt = db.prepare('DELETE FROM recommended_activities WHERE user_id = ?');
    const insertStmt = db.prepare('INSERT INTO recommended_activities (user_id, activity_name) VALUES (?, ?)');

    const transaction = db.transaction(() => {
      // Clear existing activities
      deleteStmt.run(userId);

      // Insert new activities
      activities.forEach(activity => {
        if (activity && activity.trim()) {
          insertStmt.run(userId, activity.trim());
        }
      });
    });

    transaction();

    const savedActivities = db.prepare(
      'SELECT activity_name FROM recommended_activities WHERE user_id = ? ORDER BY created_at ASC'
    ).all(userId);

    res.json({ 
      activities: savedActivities.map(a => a.activity_name) 
    });
  } catch (err) {
    console.error('Save recommended activities error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
