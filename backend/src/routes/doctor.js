import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// GET /api/doctor/patients — List all patients for this doctor
router.get('/patients', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id, p.name, p.age, p.city, p.baseline_hba1c, p.day90_hba1c,
        -- Calculate adherence for last 7 days
        COALESCE(
          ROUND(
            COUNT(*) FILTER (WHERE d.status = 'taken') * 100.0 /
            NULLIF(COUNT(d.id), 0)
          ), 0
        ) as adherence_percent,
        -- Count unresolved emergencies
        (SELECT COUNT(*) FROM emergencies e
         WHERE e.patient_id = p.id AND e.resolved = FALSE) as flag_count
      FROM patients p
      LEFT JOIN doses d ON d.patient_id = p.id
        AND d.scheduled_at >= NOW() - INTERVAL '7 days'
      GROUP BY p.id
      ORDER BY
        (SELECT COUNT(*) FROM emergencies e WHERE e.patient_id = p.id AND e.resolved = FALSE) DESC,
        p.name ASC
    `);

    res.json({ patients: result.rows });
  } catch (err) {
    console.error('Doctor patients error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/doctor/summary/:id — Weekly summary for a specific patient
router.get('/summary/:id', async (req, res) => {
  const patientId = req.params.id;

  try {
    const patient = await pool.query('SELECT * FROM patients WHERE id = $1', [patientId]);
    const medicines = await pool.query('SELECT * FROM medicines WHERE patient_id = $1', [patientId]);

    // Adherence stats (7 days)
    const adherence = await pool.query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'taken') as taken,
        COUNT(*) FILTER (WHERE status = 'missed') as missed
      FROM doses WHERE patient_id = $1 AND scheduled_at >= NOW() - INTERVAL '7 days'
    `, [patientId]);

    // Meal stats (7 days)
    const meals = await pool.query(`
      SELECT
        COUNT(*) as logged,
        COUNT(*) FILTER (WHERE swap_accepted = TRUE) as swaps_accepted
      FROM meals WHERE patient_id = $1 AND logged_at >= NOW() - INTERVAL '7 days'
    `, [patientId]);

    // Flags (unresolved emergencies)
    const flags = await pool.query(`
      SELECT * FROM emergencies
      WHERE patient_id = $1 AND resolved = FALSE
      ORDER BY created_at DESC
    `, [patientId]);

    const stats = adherence.rows[0];

    res.json({
      patient: patient.rows[0],
      medicines: medicines.rows,
      adherence: {
        total: parseInt(stats.total),
        taken: parseInt(stats.taken),
        missed: parseInt(stats.missed),
        percent: stats.total > 0 ? Math.round((stats.taken / stats.total) * 100) : 0
      },
      meals: {
        logged: parseInt(meals.rows[0].logged),
        swapsAccepted: parseInt(meals.rows[0].swaps_accepted)
      },
      flags: flags.rows
    });
  } catch (err) {
    console.error('Doctor summary error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/doctor/review/:id — Mark patient as reviewed
router.post('/review/:id', async (req, res) => {
  const patientId = req.params.id;
  await pool.query(
    `INSERT INTO audit_log (patient_id, actor, action, detail)
     VALUES ($1, 'doctor', 'reviewed', 'Weekly summary reviewed')`,
    [patientId]
  );
  res.json({ success: true });
});

export default router;
