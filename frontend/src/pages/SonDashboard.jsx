import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';

export default function SonDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      const res = await fetch(`/api/son/dashboard?patientId=${user.patientId}`);
      if (res.ok) setData(await res.json());
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Hi Arjun</h1>
          <p>Papa's health overview</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--green-light)', color: 'var(--green)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600 }}>
            <span>🔒</span> DPDP Verified
          </div>
          <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>Consent Active</p>
        </div>
      </div>

      {data.alerts.length > 0 && (
        <div className="card alert-pulse mb-3">
          <div className="flex-row mb-1">
            <span style={{ color: 'var(--red)', fontWeight: 'bold' }}>⚠️ Active Alert</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Just now</span>
          </div>
          <p style={{ fontSize: '0.9rem' }}>{data.alerts[0].type === 'feeling_unwell' ? 'Papa reported feeling unwell.' : 'Emergency keyword detected.'}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Coordinator Priya has been notified and will call him.</p>
        </div>
      )}

      <div className="card mb-3">
        <h3 className="mb-2">Today's Medicines</h3>
        {data.todayDoses.map(dose => (
          <div key={dose.id} className="flex-row mb-2" style={{ paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
            <div>
              <div style={{ fontWeight: '600' }}>{dose.medicine_name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(dose.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
            {dose.status === 'taken' ? (
              <span className="badge badge-green">Taken</span>
            ) : dose.status === 'missed' ? (
              <span className="badge badge-red">Missed</span>
            ) : (
              <span className="badge badge-orange">Pending</span>
            )}
          </div>
        ))}
      </div>

      <div className="card mb-3">
        <div className="flex-row mb-2">
          <h3>Weekly Adherence</h3>
          <span className="badge badge-green">{data.weeklyAdherence.percent}%</span>
        </div>
        <div className="progress-bar mb-1">
          <div className="progress-fill" style={{ width: `${data.weeklyAdherence.percent}%` }}></div>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Papa took {data.weeklyAdherence.taken} out of {data.weeklyAdherence.total} doses this week.
        </p>
      </div>

      <div className="card mb-3">
        <div className="flex-row mb-2">
          <h3>Day 90 Lab Test</h3>
          <span className="badge badge-orange">Due in 5 days</span>
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }}>Book Home Collection</button>
      </div>

      <BottomNav />
    </div>
  );
}
