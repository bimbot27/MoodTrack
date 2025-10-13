import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function Dashboard() {
  const [summary, setSummary] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/api/me/summary`, { headers }),
      fetch(`${API}/api/me/responses`, { headers })
    ]).then(async ([a,b]) => {
      const s = await a.json();
      const h = await b.json();
      if (!a.ok) throw new Error(s.error || 'Error');
      if (!b.ok) throw new Error(h.error || 'Error');
      setSummary(s.latest || []);
      setHistory(h || []);
    }).catch(e => setError(e.message));
  }, []);

  return (
    <div>
      <h2>Mi Dashboard</h2>
      {error && <div className="error">{error}</div>}
      <div className="cards">
        {summary.map((s) => (
          <div className="card" key={s.type}>
            <h3>{s.type.toUpperCase()}</h3>
            <p>Puntaje: <strong>{s.score}</strong></p>
            <p>Severidad: <strong>{s.severity}</strong></p>
            <p>{new Date(s.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <h3>Historial</h3>
      <ul>
        {history.map(r => (
          <li key={r.id}>{r.type.toUpperCase()} — {r.score} — {r.severity} — {new Date(r.created_at).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}

