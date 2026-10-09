import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const user = JSON.parse(localStorage.getItem('user'));
  const homeRoute = user ? `/${user.role.toLowerCase()}` : '/';

  const isHome = currentPath === homeRoute || currentPath === '/son' || currentPath === '/doctor' || currentPath === '/coordinator';
  const isChat = currentPath === '/chat';
  const isSettings = currentPath === '/settings';
  const isReports = currentPath === '/reports';

  return (
    <div style={{ 
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '390px', maxWidth: '100%', height: '70px', 
      background: 'white', borderTop: '1px solid #e5e7eb',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 1000
    }}>
      
      {/* Home */}
      <div 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: isHome ? '#4f46e5' : '#9ca3af', cursor: 'pointer' }}
        onClick={() => navigate(homeRoute)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill={isHome ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span style={{ fontSize: '10px', marginTop: '4px', fontWeight: isHome ? '600' : '500' }}>Home</span>
      </div>

      {/* Conditional Middle Tab */}
      {user?.role?.toLowerCase() === 'doctor' ? (
        <div 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: currentPath === '/revenue' ? '#4f46e5' : '#9ca3af', cursor: 'pointer' }}
          onClick={() => navigate('/revenue')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          <span style={{ fontSize: '10px', marginTop: '4px', fontWeight: currentPath === '/revenue' ? '600' : '500' }}>Revenue</span>
        </div>
      ) : (
        <div 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: isReports ? '#4f46e5' : '#9ca3af', cursor: 'pointer' }}
          onClick={() => navigate('/reports')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={isReports ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span style={{ fontSize: '10px', marginTop: '4px', fontWeight: isReports ? '600' : '500' }}>Reports</span>
        </div>
      )}

      {/* Settings */}
      <div 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: isSettings ? '#4f46e5' : '#9ca3af', cursor: 'pointer' }} 
        onClick={() => navigate('/settings')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill={isSettings ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        <span style={{ fontSize: '10px', marginTop: '4px', fontWeight: isSettings ? '600' : '500' }}>Settings</span>
      </div>

    </div>
  );
}
