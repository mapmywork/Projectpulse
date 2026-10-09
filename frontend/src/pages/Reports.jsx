import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function Reports() {
  const navigate = useNavigate();

  const reports = [
    { id: 3, title: 'Week 3 Summary', date: '12 - 18 Jan', status: 'Available' },
    { id: 2, title: 'Week 2 Summary', date: '05 - 11 Jan', status: 'Available' },
    { id: 1, title: 'Week 1 Summary', date: '29 Dec - 04 Jan', status: 'Available' },
  ];

  return (
    <div className="page" style={{ 
      display: 'flex', flexDirection: 'column', height: '100vh', 
      background: '#e8eff5', padding: 0, margin: '0 auto', maxWidth: '480px' 
    }}>
      
      {/* Top Header */}
      <div style={{ 
        background: '#1f2937', color: 'white', padding: '16px 20px', 
        display: 'flex', alignItems: 'center', gap: '16px',
        borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </div>
        <h1 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>All Weekly Reports</h1>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '80px' }}>
        
        <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>Dad's Reports</h2>

        {/* List of Reports */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reports.map((report) => (
            <div 
              key={report.id}
              onClick={() => navigate(`/reports/${report.id}`)}
              style={{ 
                background: 'white', borderRadius: '16px', padding: '16px', 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer',
                transition: 'transform 0.1s ease'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>
                  {report.title}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  {report.date}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#10b981', background: '#d1fae5', padding: '4px 8px', borderRadius: '8px' }}>
                  {report.status}
                </span>
                <div style={{ color: '#9ca3af' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
