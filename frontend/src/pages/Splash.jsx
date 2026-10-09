import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="page" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between',
      height: '100vh',
      padding: '40px 24px 30px' 
    }}>
      
      {/* Top Section - Logo */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '8px'
        }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            background: 'var(--primary)', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)' }}>Pulse</span>
        </div>
      </div>

      {/* Middle Section - Title & Features */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '800', 
          textAlign: 'center', 
          lineHeight: '1.2',
          marginBottom: '40px',
          color: '#1a1a1a'
        }}>
          Help your loved one manage diabetes every day
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingLeft: '10px' }}>
          
          {/* Feature 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '40px', height: '40px', 
              borderRadius: '50%', 
              background: '#ede9fe', 
              color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px'
            }}>
              💊
            </div>
            <span style={{ fontSize: '16px', fontWeight: '500', color: '#4a4a4a' }}>Medication reminders</span>
          </div>

          {/* Feature 2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '40px', height: '40px', 
              borderRadius: '50%', 
              background: '#ede9fe', 
              color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px'
            }}>
              🍽️
            </div>
            <span style={{ fontSize: '16px', fontWeight: '500', color: '#4a4a4a' }}>Personalised food guidance</span>
          </div>

          {/* Feature 3 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '40px', height: '40px', 
              borderRadius: '50%', 
              background: '#ede9fe', 
              color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px'
            }}>
              👨‍👩‍👦
            </div>
            <span style={{ fontSize: '16px', fontWeight: '500', color: '#4a4a4a' }}>Family support</span>
          </div>

          {/* Feature 4 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '40px', height: '40px', 
              borderRadius: '50%', 
              background: '#ede9fe', 
              color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px'
            }}>
              📄
            </div>
            <span style={{ fontSize: '16px', fontWeight: '500', color: '#4a4a4a' }}>Doctor reports</span>
          </div>

        </div>
      </div>

      {/* Bottom Section - Buttons */}
      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={() => {
            localStorage.setItem('user', JSON.stringify({ role: 'son', accessCode: 'SON2026' }));
            navigate('/add-loved-one');
          }} 
          className="btn" 
          style={{ 
            width: '100%', 
            padding: '16px', 
            fontSize: '16px', 
            fontWeight: '600',
            borderRadius: '12px',
            marginBottom: '16px',
            background: '#6366f1' // Slightly softer purple to match design
          }}
        >
          Set up for a loved one
        </button>
        <p style={{ fontSize: '14px', color: '#4a4a4a' }}>
          Are you a Doctor? <span 
            onClick={() => {
              localStorage.setItem('user', JSON.stringify({ role: 'doctor', accessCode: 'DOC2026' }));
              navigate('/doctor');
            }}
            style={{ color: '#2563eb', fontWeight: '600', cursor: 'pointer' }}
          >Go to Clinic Dashboard</span>
        </p>
      </div>

    </div>
  );
}
