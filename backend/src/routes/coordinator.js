import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// GET /api/coordinator/alerts — All emergencies
router.get('/alerts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, p.name as patient_name, p.age, p.city, p.phone_wa
      FROM emergencies e
      JOIN patients p ON e.patient_id = p.id
      ORDER BY e.resolved ASC, e.created_at DESC
    `);

    const active = result.rows.filter(r => !r.resolved);
    const resolved = result.rows.filter(r => r.resolved);

    res.json({ active, resolved });
  } catch (err) {
    console.error('Coordinator alerts error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/coordinator/resolve — Resolve an alert with a note
router.post('/resolve', async (req, res) => {
  const { alertId, note } = req.body;

  try {
    await pool.query(
      `UPDATE emergencies
       SET resolved = TRUE, coordinator_note = $1, resolved_at = NOW()
       WHERE id = $2`,
      [note, alertId]
    );

    await pool.query(
      `INSERT INTO audit_log (patient_id, actor, action, detail)
       VALUES ((SELECT patient_id FROM emergencies WHERE id = $1), 'coordinator', 'resolved_alert', $2)`,
      [alertId, note]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Resolve error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
