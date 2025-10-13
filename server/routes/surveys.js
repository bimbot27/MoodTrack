const express = require('express');
const { query } = require('../db');
const auth = require('../middleware/auth');
const { scoreByType } = require('../utils/scoring');
const { getQuestions } = require('../utils/questions');

const router = express.Router();

router.get('/:type/questions', async (req, res) => {
  try {
    const type = (req.params.type || '').toLowerCase();
    const spec = getQuestions(type);
    if (!spec) return res.status(404).json({ error: 'Encuesta no encontrada' });
    res.json({ type: spec.type, items: spec.items });
  } catch (e) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/:type/submit', auth, async (req, res) => {
  try {
    const type = (req.params.type || '').toLowerCase();
    const spec = getQuestions(type);
    if (!spec) return res.status(404).json({ error: 'Encuesta no encontrada' });
    const { answers, ts } = req.body; // answers: number[], ts optional
    if (!Array.isArray(answers) || answers.length === 0) return res.status(400).json({ error: 'Respuestas inválidas' });
    const { total, severity } = scoreByType(type, answers);
    const when = Number.isFinite(ts) ? Number(ts) : Date.now();
    await query(
      'INSERT INTO responses (user_id, instrument, total, max, severity, answers, ts) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, spec.instrument, total, spec.max, severity, JSON.stringify(answers), when]
    );
    res.json({ type, score: total, severity });
  } catch (e) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
