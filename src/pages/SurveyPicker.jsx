import React from 'react';
import { Link } from 'react-router-dom';

export default function SurveyPicker() {
  return (
    <div>
      <h2>Selecciona una encuesta</h2>
      <ul>
        <li><Link to="/survey/phq9">PHQ‑9</Link></li>
        <li><Link to="/survey/madrs">MADRS</Link></li>
        <li><Link to="/survey/beck">Beck (BDI‑II)</Link></li>
      </ul>
    </div>
  );
}

