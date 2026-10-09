import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function SonDashboard() {
  const navigate = useNavigate();

  return (
    <div className="page" style={{ 
      display: 'flex', flexDirection: 'column', height: '100vh', 
      background: '#fafafa', paddingBottom: '60px' 
    }}>
      
      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '24px', marginTop: '16px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Good morning, Rahul 👋
          </h1>
          <p style={{ fontSize: '15px', color: '#6b7280', marginTop: '4px' }}>
            Here's Dad's Day 0 summary
          </p>
        </div>

        {/* Profile Card */}
        <div style={{ 
          background: 'white', borderRadius: '16px', padding: '16px', 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '12px', border: '1px solid #f3f4f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '50%', background: '#bfdbfe',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden'
            }}>
               <div style={{ width: '80%', height: '80%', background: '#60a5fa', borderTopLeftRadius: '50%', borderTopRightRadius: '50%' }}>
                  <div style={{ width: '20px', height: '20px', background: '#f5c5a3', borderRadius: '50%', margin: '-10px auto 0' }}></div>
               </div>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>Ramesh Kumar</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>56 • Kanpur</div>
            </div>
          </div>
          <div style={{ 
            background: '#fef2f2', color: '#ef4444', fontSize: '12px', fontWeight: '700', 
            padding: '6px 12px', borderRadius: '12px', textAlign: 'center', lineHeight: '1.2'
          }}>
            Just<br/>started
          </div>
        </div>

        {/* Baseline Card */}
        <div style={{ 
          background: '#fff4f2', borderRadius: '16px', padding: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <div>
            <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
              Baseline HbA1c <span style={{ fontSize: '16px' }}>🩸</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '32px', fontWeight: '800', color: '#7f1d1d' }}>8.4%</span>
              <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>Day 0</span>
            </div>
          </div>
          
          <div style={{ 
            background: 'white', padding: '10px 12px', borderRadius: '12px', 
            display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}>
            <div style={{ color: '#6366f1' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#4a4a4a', fontWeight: '600' }}>Next test</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>in 90 days</div>
            </div>
          </div>
        </div>

        {/* Let's get started Section */}
        <div style={{ background: '#f0fdf4', borderRadius: '20px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1a1a1a', marginBottom: '20px' }}>Let's get started</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Item 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', background: '#ffedd5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                💊
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>Medicines scheduled</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>3 medicines added</div>
              </div>
              <div style={{ color: '#16a34a' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                </svg>
              </div>
            </div>

            {/* Item 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', background: '#e0e7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#6366f1' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>Home test booked</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>Tomorrow, 10 AM - 12 PM</div>
              </div>
              <div style={{ color: '#16a34a' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                </svg>
              </div>
            </div>

            {/* Item 3 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', background: '#ffedd5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                🔔
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>Daily reminders active</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>We'll remind Dad</div>
              </div>
              <div style={{ color: '#16a34a' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                </svg>
              </div>
            </div>

          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
