import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// POST /api/auth/login
// Body: { code: "SON2026" }
// Returns: { role, name, patientId } or 401
router.post('/login', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Access code is required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, patient_id, role, name FROM contacts WHERE access_code = $1',
      [code.toUpperCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid access code' });
    }

    const contact = result.rows[0];
    res.json({
      role: contact.role,
      name: contact.name,
      patientId: contact.patient_id,
      contactId: contact.id
    });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
