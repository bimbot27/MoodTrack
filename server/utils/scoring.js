function scorePHQ9(answers) {
  const total = answers.reduce((a, b) => a + (Number(b) || 0), 0);
  let severity = 'Ninguna';
  if (total >= 5 && total <= 9) severity = 'Leve';
  else if (total <= 14) severity = 'Moderada';
  else if (total <= 19) severity = 'Moderadamente severa';
  else if (total >= 20) severity = 'Severa';
  return { total, severity };
}

function scoreMADRS(answers) {
  const total = answers.reduce((a, b) => a + (Number(b) || 0), 0);
  // Common interpretation ranges (0-60)
  let severity = 'Ninguna';
  if (total >= 7 && total <= 19) severity = 'Leve';
  else if (total <= 34) severity = 'Moderada';
  else if (total >= 35) severity = 'Severa';
  return { total, severity };
}

function scoreBDI(answers) {
  const total = answers.reduce((a, b) => a + (Number(b) || 0), 0);
  let severity = 'Mínima';
  if (total >= 10 && total <= 18) severity = 'Leve';
  else if (total <= 29) severity = 'Moderada';
  else if (total >= 30) severity = 'Severa';
  return { total, severity };
}

function scoreByType(type, answers) {
  switch ((type || '').toLowerCase()) {
    case 'phq9':
      return scorePHQ9(answers);
    case 'madrs':
      return scoreMADRS(answers);
    case 'bdi':
    case 'beck':
      return scoreBDI(answers);
    default:
      throw new Error('Tipo de encuesta no soportado');
  }
}

module.exports = { scoreByType };

