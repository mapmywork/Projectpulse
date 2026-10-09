import pool from '../db.js';

// Check if a patient has 3+ consecutive missed doses
export async function checkMissedStreak(patientId) {
  const result = await pool.query(`
    SELECT status FROM doses
    WHERE patient_id = $1
    ORDER BY scheduled_at DESC
    LIMIT 3
  `, [patientId]);

  const allMissed = result.rows.length === 3 &&
    result.rows.every(r => r.status === 'missed');

  if (allMissed) {
    await pool.query(`
      INSERT INTO emergencies (patient_id, type, context, severity)
      VALUES ($1, 'missed_streak', '3 consecutive doses missed', 'high')
    `, [patientId]);
    return true;
  }
  return false;
}

// Distress keywords in Hindi
export const DISTRESS_KEYWORDS = [
  'chakkar', 'gir gaya', 'behosh', 'dard',
  'dar lag', 'tabiyat kharab', 'kamzori',
  'aankhon mein andhera', 'saans nahi aa rahi'
];
