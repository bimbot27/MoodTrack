const BANK = {
  phq9: {
    instrument: 'PHQ-9',
    maxPerItem: 3,
    items: [
      'Poco interés o placer en hacer cosas',
      'Se ha sentido decaído/a, deprimido/a o sin esperanzas',
      'Dificultad para dormir o dormir demasiado',
      'Se ha sentido cansado/a o con poca energía',
      'Poco apetito o comer en exceso',
      'Se siente mal consigo mismo/a, fracasado/a, o ha quedado mal consigo mismo/a o con su familia',
      'Dificultad para concentrarse (leer, TV, etc.)',
      'Se mueve o habla muy lento, o lo contrario: inquieto/a o agitado/a',
      'Pensamientos de estar mejor muerto/a o de hacerse daño'
    ]
  },
  madrs: {
    instrument: 'MADRS',
    maxPerItem: 6,
    items: [
      'Tristeza aparente',
      'Tristeza reportada',
      'Tensión interna',
      'Sueño reducido',
      'Apetito reducido',
      'Dificultad de concentración',
      'Incapacidad para sentir',
      'Pesimismo',
      'Pensamientos suicidas',
      'Labilidad emocional'
    ]
  },
  beck: {
    instrument: 'Beck (BDI-II)',
    maxPerItem: 3,
    items: [
      'Tristeza','Pesimismo','Fracaso','Pérdida de placer','Sentimientos de culpa',
      'Sentimientos de castigo','Autodesprecio','Autocrítica','Pensamientos o deseos suicidas','Llanto',
      'Agitación','Pérdida de interés','Indecisión','Desvalorización','Pérdida de energía',
      'Cambios en los hábitos de sueño','Irritabilidad','Cambios en el apetito','Dificultad de concentración','Cansancio o fatiga','Pérdida de interés en el sexo'
    ]
  }
};

function getQuestions(typeKey) {
  const key = (typeKey || '').toLowerCase();
  const spec = BANK[key];
  if (!spec) return null;
  const items = spec.items.map((q, i) => ({ item_index: i + 1, question_text: q, max_score: spec.maxPerItem }));
  const max = spec.items.length * spec.maxPerItem;
  return { type: key, instrument: spec.instrument, items, max };
}

module.exports = { getQuestions };

