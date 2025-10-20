import './App.css';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SurveyPicker from './pages/SurveyPicker';
import SurveyForm from './pages/SurveyForm';
import Dashboard from './pages/Dashboard';

function Nav() {
  const token = localStorage.getItem('token');
  const logout = () => { localStorage.removeItem('token'); window.location.href='/' };
  return (
    <nav className="nav">
      <Link to="/">MoodTrack</Link>
      <div>
        <Link to="/surveys">Encuestas</Link>
        {token ? (<>
          <Link to="/dashboard">Dashboard</Link>
          <button onClick={logout} className="linklike">Salir</button>
        </>) : (<Link to="/login">Entrar</Link>)}
      </div>
    </nav>
  )
}

function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <div className="container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/surveys" element={<SurveyPicker />} />
          <Route path="/survey/:type" element={<SurveyForm />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
