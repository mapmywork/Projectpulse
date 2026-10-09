import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';

export default function CoordinatorDashboard() {
  const [data, setData] = useState(null);
  const [resolving, setResolving] = useState(null);
  const [note, setNote] = useState('');

  const fetchData = async () => {
    const res = await fetch(`/api/coordinator/alerts`);
    if (res.ok) setData(await res.json());
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleResolve = async (id) => {
    await fetch(`/api/coordinator/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alertId: id, note: note || 'Resolved over phone call' })
    });
    setResolving(null);
    setNote('');
    fetchData();
  };

  if (!data) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Pulse Operations</h1>
        <p>Active Patient Alerts</p>
      </div>

      <div className="flex-row mb-2">
        <h3 style={{ color: 'var(--red)' }}>Active ({data.active.length})</h3>
      </div>

      {data.active.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          No active alerts right now.
        </div>
      ) : (
        data.active.map(alert => (
          <div key={alert.id} className="card alert-pulse mb-2">
            <div className="flex-row mb-1">
              <span className="badge badge-red">{alert.severity.toUpperCase()}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {new Date(alert.created_at).toLocaleTimeString()}
              </span>
            </div>
            
            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{alert.patient_name}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Phone: {alert.phone_wa}
            </p>
            
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.9rem' }}>
              <strong>Context:</strong> {alert.context}
            </div>

            {resolving === alert.id ? (
              <div>
                <input 
                  type="text" 
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Resolution note..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--bg)', color: 'var(--text-primary)', marginBottom: '8px' }}
                />
                <div className="flex-row">
                  <button className="btn btn-secondary" style={{ padding: '8px 12px' }} onClick={() => setResolving(null)}>Cancel</button>
                  <button className="btn btn-primary" style={{ padding: '8px 12px' }} onClick={() => handleResolve(alert.id)}>Mark Resolved</button>
                </div>
              </div>
            ) : (
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setResolving(alert.id)}>
                Resolve Alert
              </button>
            )}
          </div>
        ))
      )}

      <h3 className="mt-3 mb-2" style={{ color: 'var(--green)' }}>Recently Resolved</h3>
      {data.resolved.slice(0, 3).map(alert => (
        <div key={alert.id} className="card mb-2" style={{ opacity: 0.7 }}>
          <div className="flex-row">
            <strong>{alert.patient_name}</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(alert.resolved_at).toLocaleDateString()}</span>
          </div>
          <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Note: {alert.coordinator_note}</div>
        </div>
      ))}

      <BottomNav />
    </div>
  );
}
