import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function SurveyForm() {
  const { type } = useParams();
  const [items, setItems] = useState([]);
  
  // --- 1. CORREGIDO: Renombrado a 'options' (plural) ---
  const [options, setOptions] = useState([]); 
  
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    fetch(`${API}/api/surveys/${type}/questions`)
      .then(r => r.json())
      .then(d => { 
        if (d.items){
          setItems(d.items);
          // --- 2. CORREGIDO: Lee 'd.options' (plural) ---
          setOptions(d.options || []); 
        } else {
          setError(d.error || 'Error');
        }
      })
      .catch(() => setError('No se pudieron cargar las preguntas'));
  }, [type]);

  // Tu función 'submit' está perfecta. No necesita cambios.
  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    if (!token) { setError('Necesitas iniciar sesión para enviar.'); return; }
    const ordered = items.map(it => Number(answers[it.item_index] || 0));
    try {
      const res = await fetch(`${API}/api/surveys/${type}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ answers: ordered })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setResult(data);
    } catch (e) { setError(e.message); }
  };

  // Esta función ya no es necesaria
  // const maxScore = (it) => it.max_score || 3;

  return (
    <div>
      <h2>Encuesta: {type?.toUpperCase()}</h2>
      {error && <div className="error">{error}</div>}
      {!items.length ? <p>Cargando…</p> : (
        <form onSubmit={submit} className="form">
          {items.map(it => (
            <div key={it.item_index} className="question">
              <label><strong>{it.item_index}.</strong> {it.question_text}</label>
              <select value={answers[it.item_index] || ''} onChange={(e) => setAnswers(a => ({ ...a, [it.item_index]: e.target.value }))} required>
                <option value="" disabled>Selecciona…</option>
                
                {/* --- 3. CORREGIDO: Usa el estado 'options' --- */}
                {/* Esto mostrará "Ningún día", "Varios días", etc. */}
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}

              </select>
            </div>
          ))}
          <button type="submit">Enviar</button>
        </form>
      )}
      {result && (
        <div className="card">
          <h3>Resultado</h3>
          <p>Puntaje: <strong>{result.score}</strong></p>
          <p>Severidad: <strong>{result.severity}</strong></p>
          <p>Nivel de Riesgo: <strong>{result.riskLevel}</strong></p>
        </div>
      )}
    </div>
  );
}
