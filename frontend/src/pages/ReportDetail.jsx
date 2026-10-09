import { useNavigate, useParams } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function ReportDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // Could use ID to fetch specific report data later

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
        <h1 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Pulse - Doctor Portal</h1>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '80px' }}>
        
        {/* Profile Section */}
        <div style={{ 
          background: 'white', borderRadius: '16px', padding: '16px', 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '50px', height: '50px', borderRadius: '50%', background: '#bfdbfe',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden'
            }}>
               <div style={{ width: '80%', height: '80%', background: '#60a5fa', borderTopLeftRadius: '50%', borderTopRightRadius: '50%' }}>
                  <div style={{ width: '20px', height: '20px', background: '#f5c5a3', borderRadius: '50%', margin: '-10px auto 0' }}></div>
               </div>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>Ramesh Kumar</div>
              <div style={{ fontSize: '14px', color: '#9ca3af' }}>56 yrs • Kanpur</div>
            </div>
          </div>
          <div style={{ color: '#9ca3af' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>

        {/* Week Summary */}
        <div style={{ 
          background: 'white', borderRadius: '16px', padding: '20px', 
          marginBottom: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>Week {id || 3} Summary</h2>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>12 - 18 Jan</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#4b5563' }}>
                <span style={{ color: '#10b981' }}>◎</span> Medication adherence
              </div>
              <div style={{ fontWeight: '700', color: '#10b981' }}>89%</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#4b5563' }}>
                <span style={{ color: '#06b6d4' }}>🍽️</span> Meal adherence
              </div>
              <div style={{ fontWeight: '700', color: '#10b981' }}>72%</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#4b5563' }}>
                <span style={{ color: '#f59e0b' }}>📈</span> Glucose trend
              </div>
              <div style={{ fontWeight: '700', color: '#10b981' }}>Improving</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#4b5563' }}>
                <span style={{ color: '#f59e0b' }}>⚠️</span> Main barrier
              </div>
              <div style={{ fontWeight: '600', color: '#374151' }}>Late dinners</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#4b5563' }}>
                <span style={{ color: '#ef4444' }}>🚩</span> Safety flags
              </div>
              <div style={{ fontWeight: '600', color: '#10b981' }}>None</div>
            </div>

          </div>
        </div>

        {/* Suggested Focus */}
        <div style={{ 
          background: 'white', borderRadius: '16px', padding: '20px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 16px 0' }}>Suggested focus</h2>
          <ul style={{ margin: 0, paddingLeft: '24px', color: '#4b5563', fontSize: '14px', lineHeight: '1.6' }}>
            <li style={{ marginBottom: '8px' }}>Continue current routine</li>
            <li>Review glucose trend at next consultation</li>
          </ul>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
