const express = require('express');
const { query } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/responses', auth, async (req, res) => {
  try {
    const rows = await query(
      'SELECT id, instrument, total, severity, created_at FROM responses WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    // Map to frontend shape
    const data = rows.map(r => ({
      id: r.id,
      type: instrumentToKey(r.instrument),
      score: r.total,
      severity: r.severity,
      created_at: r.created_at
    }));
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/summary', auth, async (req, res) => {
  try {
    const rows = await query(
      `SELECT instrument, total, severity, created_at
       FROM v_latest_response_per_instrument
       WHERE user_id = ?
       ORDER BY instrument`,
      [req.user.id]
    );
    const latest = rows.map(r => ({
      type: instrumentToKey(r.instrument),
      score: r.total,
      severity: r.severity,
      created_at: r.created_at
    }));
    res.json({ latest });
  } catch (e) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

function instrumentToKey(instrument) {
  const s = (instrument || '').toLowerCase();
  if (s.includes('phq')) return 'phq9';
  if (s.includes('madrs')) return 'madrs';
  if (s.includes('beck')) return 'beck';
  return s;
}

module.exports = router;
