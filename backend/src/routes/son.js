import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// GET /api/son/dashboard?patientId=1
router.get('/dashboard', async (req, res) => {
  const patientId = req.query.patientId || 1;

  try {
    // 1. Patient info
    const patient = await pool.query(
      'SELECT * FROM patients WHERE id = $1', [patientId]
    );

    // 2. Medicines with supply days
    const medicines = await pool.query(
      'SELECT * FROM medicines WHERE patient_id = $1', [patientId]
    );

    // 3. Today's doses
    const todayDoses = await pool.query(
      `SELECT d.*, m.name as medicine_name, m.dosage
       FROM doses d JOIN medicines m ON d.medicine_id = m.id
       WHERE d.patient_id = $1 AND d.scheduled_at::date = CURRENT_DATE
       ORDER BY d.scheduled_at`,
      [patientId]
    );

    // 4. Weekly adherence (last 7 days)
    const weeklyStats = await pool.query(
      `SELECT
         COUNT(*) as total,
         COUNT(*) FILTER (WHERE status = 'taken') as taken,
         COUNT(*) FILTER (WHERE status = 'missed') as missed
       FROM doses
       WHERE patient_id = $1
         AND scheduled_at >= NOW() - INTERVAL '7 days'`,
      [patientId]
    );

    const stats = weeklyStats.rows[0];
    const adherencePercent = stats.total > 0
      ? Math.round((stats.taken / stats.total) * 100)
      : 0;

    // 5. Active alerts (missed doses, emergencies)
    const alerts = await pool.query(
      `SELECT * FROM emergencies
       WHERE patient_id = $1 AND resolved = FALSE
       ORDER BY created_at DESC`,
      [patientId]
    );

    // 6. Consent matrix (what son can see)
    const consent = await pool.query(
      `SELECT * FROM consent WHERE patient_id = $1 AND target_role = 'son'`,
      [patientId]
    );

    res.json({
      patient: patient.rows[0],
      medicines: medicines.rows,
      todayDoses: todayDoses.rows,
      weeklyAdherence: {
        total: parseInt(stats.total),
        taken: parseInt(stats.taken),
        missed: parseInt(stats.missed),
        percent: adherencePercent
      },
      alerts: alerts.rows,
      consent: consent.rows[0] || {}
    });

  } catch (err) {
    console.error('Son dashboard error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/son/book-lab
router.post('/book-lab', async (req, res) => {
  const { patientId, type } = req.body; // type: 'baseline' or 'day90'
  await pool.query(
    `INSERT INTO audit_log (patient_id, actor, action, detail)
     VALUES ($1, 'son', 'book_lab', $2)`,
    [patientId || 1, type || 'baseline']
  );
  res.json({ success: true, status: 'booked' });
});

export default router;
