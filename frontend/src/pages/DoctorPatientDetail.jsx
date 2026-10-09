import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function DoctorPatientDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/doctor/summary/${id}`);
      if (res.ok) setData(await res.json());
    };
    fetchData();
  }, [id]);

  const handleReview = async () => {
    await fetch(`/api/doctor/review/${id}`, { method: 'POST' });
    navigate('/doctor');
  };

  if (!data) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.2rem', cursor: 'pointer' }}>←</button>
        <div>
          <h1 style={{ margin: 0 }}>{data.patient.name}</h1>
          <p style={{ margin: 0 }}>{data.patient.age}y, {data.patient.city}</p>
        </div>
      </div>

      {data.flags.length > 0 && (
        <div className="card alert-pulse mb-3">
          <h3 className="mb-1" style={{ color: 'var(--red)' }}>🚨 Active Clinical Flags</h3>
          {data.flags.map(f => (
            <div key={f.id} style={{ fontSize: '0.85rem', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <strong>{new Date(f.created_at).toLocaleDateString()}</strong>: {f.context}
              {f.coordinator_note && (
                <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Note: {f.coordinator_note}</div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="card mb-3">
        <h3 className="mb-2">Weekly Rx Adherence</h3>
        <div className="flex-row mb-1">
          <span style={{ fontSize: '2rem', fontWeight: '700', color: data.adherence.percent > 85 ? 'var(--green)' : 'var(--orange)' }}>
            {data.adherence.percent}%
          </span>
          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div>{data.adherence.taken} Doses Taken</div>
            <div>{data.adherence.missed} Doses Missed</div>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${data.adherence.percent}%` }}></div>
        </div>
      </div>

      <div className="card mb-3">
        <h3 className="mb-2">Meal Logging</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.meals.logged}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Meals Logged</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--green)' }}>{data.meals.swapsAccepted}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Healthy Swaps</div>
          </div>
        </div>
      </div>

      <div className="card mb-3">
        <div className="flex-row mb-1">
          <h3>HbA1c Trend</h3>
          {data.patient.day90_hba1c && <span className="badge badge-green">-{(data.patient.baseline_hba1c - data.patient.day90_hba1c).toFixed(1)}</span>}
        </div>
        <div className="flex-row" style={{ padding: '12px 0' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Day 0</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{data.patient.baseline_hba1c}</div>
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>→</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Day 90</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{data.patient.day90_hba1c || 'Pending'}</div>
          </div>
        </div>
      </div>

      <button className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1rem' }} onClick={handleReview}>
        Mark as Reviewed
      </button>

      <BottomNav />
    </div>
  );
}
