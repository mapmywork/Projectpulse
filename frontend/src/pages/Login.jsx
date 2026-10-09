import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [role, setRole] = useState(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        navigate(`/${data.role}`);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100dvh' }}>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Project Pulse</h1>
        <p>Login to your dashboard</p>
      </div>

      {!role ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setRole('Son')}>
            <h3 className="mb-1">Son</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>View Adherence</p>
          </div>
          <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setRole('Doctor')}>
            <h3 className="mb-1">Doctor</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>View Patients</p>
          </div>
          <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setRole('Coordinator')}>
            <h3 className="mb-1">Coordinator</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>View Alerts</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="card">
          <h3 className="mb-2">Enter {role} Code</h3>
          <input 
            type="text" 
            value={code} 
            onChange={e => setCode(e.target.value)}
            placeholder="e.g. SON2026"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--bg)', color: 'var(--text-primary)', marginBottom: '16px' }}
          />
          {error && <p className="mb-2" style={{ color: 'var(--red)', fontSize: '0.8rem' }}>{error}</p>}
          <div className="flex-row">
            <button type="button" className="btn btn-secondary" onClick={() => setRole(null)}>Back</button>
            <button type="submit" className="btn btn-primary">Login</button>
          </div>
        </form>
      )}
    </div>
  );
}
