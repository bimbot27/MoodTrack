/**
 * Analiza las respuestas y el puntaje para predecir un nivel de riesgo.
 * Esta es la primera versión de tu "IA" (un sistema de reglas).
 *
 * @param {string} type - 'phq9', 'madrs', etc.
 * @param {number} total - El puntaje total (ej. 14)
 * @param {number[]} answers - El array de respuestas (ej. [1, 0, 3, ...])
 * @returns {string} - El nivel de riesgo (ej. 'Riesgo Alto')
 */
function predictRisk(type, total, answers) {
  let riskLevel = 'Riesgo Bajo';

  // --- LÓGICA DE PREDICCIÓN PARA PHQ-9 ---
  if (type === 'phq9') {
    
    // Regla 1: La pregunta 9 (suicidio) es el indicador más fuerte.
    // (El array 'answers' está basado en 0, así que el índice 8 es la pregunta 9)
    const answerQ9 = answers[8]; 
    if (answerQ9 > 0) {
      riskLevel = 'Riesgo Alto (Q9)'; // 'Q9' es para tu referencia interna
    }
    
    // Regla 2: Un puntaje severo también es riesgo alto.
    else if (total >= 20) {
      riskLevel = 'Riesgo Alto (Severo)';
    }
    
    // Regla 3: Un puntaje moderadamente severo es riesgo moderado.
    else if (total >= 15) {
      riskLevel = 'Riesgo Moderado';
    }
    
    // Regla 4: Un puntaje leve o mínimo es bajo.
    else if (total >= 5) {
      riskLevel = 'Riesgo Leve';
    }
  }

  // --- LÓGICA DE PREDICCIÓN PARA BECK (BDI-II) ---
  else if (type === 'beck') {
    // Regla 1: Pregunta de suicidio (índice 8, pregunta 9)
    const answerQ9 = answers[8];
    if (answerQ9 > 1) { // 2 o 3 en Beck es riesgo alto
      riskLevel = 'Riesgo Alto (Q9)';
    }
    else if (total >= 40) {
      riskLevel = 'Riesgo Alto (Severo)';
    }
    else if (total >= 29) {
      riskLevel = 'Riesgo Moderado';
    }
    else if (total >= 20) {
      riskLevel = 'Riesgo Leve';
    }
  }
  
  // (Aquí puedes añadir 'else if (type === 'madrs')' en el futuro)

  return riskLevel;
}

module.exports = {
  predictRisk
};