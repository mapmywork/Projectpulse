import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// GET /api/chat — Get all messages
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM chats ORDER BY created_at ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Chat GET error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/chat — Send a message
router.post('/', async (req, res) => {
  const { senderRole, senderName, message } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO chats (sender_role, sender_name, message) VALUES ($1, $2, $3) RETURNING *',
      [senderRole, senderName, message]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Chat POST error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
