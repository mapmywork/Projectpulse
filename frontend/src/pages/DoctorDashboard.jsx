import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function DoctorDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/doctor/patients`);
      if (res.ok) setData(await res.json());
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dr. Mehra's Clinic</h1>
        <p>Patient Overview</p>
      </div>

      <div className="mb-3">
        <input 
          type="text" 
          placeholder="Search patients..." 
          style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
        />
      </div>

      {data.patients.map(patient => (
        <div key={patient.id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/doctor/patient/${patient.id}`)}>
          <div className="flex-row mb-1">
            <h3 style={{ fontSize: '1.1rem' }}>{patient.name} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>({patient.age}y)</span></h3>
            {patient.flag_count > 0 && (
              <span className="badge badge-red">{patient.flag_count} Alerts</span>
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Adherence</div>
              <div style={{ fontWeight: '600', color: patient.adherence_percent > 85 ? 'var(--green)' : 'var(--orange)' }}>{patient.adherence_percent}%</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>HbA1c</div>
              <div style={{ fontWeight: '600' }}>{patient.day90_hba1c || patient.baseline_hba1c}</div>
            </div>
          </div>
        </div>
      ))}

      <BottomNav />
    </div>
  );
}
