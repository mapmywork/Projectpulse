import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function Settings() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account preferences</p>
      </div>

      <div className="card mb-3">
        <h3 className="mb-2">Profile</h3>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Name</div>
          <div style={{ fontWeight: '500' }}>{user.name}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Role</div>
          <div style={{ fontWeight: '500' }}>{user.role}</div>
        </div>
      </div>

      <div className="card mb-3">
        <h3 className="mb-2">Preferences</h3>
        <div className="flex-row mb-2" style={{ paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
          <span>Push Notifications</span>
          <span style={{ color: 'var(--green)', fontWeight: 'bold' }}>Enabled</span>
        </div>
        <div className="flex-row mb-2" style={{ paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
          <span>Language</span>
          <span style={{ fontWeight: 'bold' }}>English</span>
        </div>
        <div className="flex-row">
          <span>Dark Mode</span>
          <span style={{ fontWeight: 'bold' }}>Off</span>
        </div>
      </div>

      <div className="card mb-3">
        <h3 className="mb-2">Support & Legal</h3>
        <div className="flex-row mb-2" style={{ paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
          <span>Help Center</span>
          <span>&gt;</span>
        </div>
        <div className="flex-row">
          <span>Privacy Policy</span>
          <span>&gt;</span>
        </div>
      </div>

      <button onClick={handleLogout} className="btn" style={{ width: '100%', background: 'var(--red)', color: 'white', marginTop: '10px' }}>
        Log Out
      </button>

      {/* Demo Shortcuts */}
      <div style={{ marginTop: '24px', padding: '16px', background: '#e0e7ff', borderRadius: '12px', marginBottom: '80px' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '12px', color: '#4f46e5', textAlign: 'center' }}>Demo Shortcuts</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => {
              localStorage.removeItem('user');
              navigate('/login', { state: { email: 'doctor@gmail.com', password: 'doc2026' } });
            }} 
            style={{ width: '100%', padding: '12px', background: 'white', color: '#4f46e5', border: '1px solid #c7d2fe', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Login as Doctor
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem('user');
              navigate('/login', { state: { email: 'coordinator@gmail.com', password: 'coord2026' } });
            }} 
            style={{ width: '100%', padding: '12px', background: 'white', color: '#4f46e5', border: '1px solid #c7d2fe', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Login as Coordinator
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
