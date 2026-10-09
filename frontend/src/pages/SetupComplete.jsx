import { useNavigate } from 'react-router-dom';

export default function SetupComplete() {
  const navigate = useNavigate();

  return (
    <div className="page" style={{ padding: '24px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Confetti & Checkmark Graphic */}
        <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
          
          {/* Confetti particles (CSS approximations) */}
          <div style={{ position: 'absolute', top: '10%', left: '20%', width: '8px', height: '8px', background: '#34d399', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', top: '30%', left: '10%', width: '10px', height: '10px', background: '#f43f5e', borderRadius: '2px', transform: 'rotate(45deg)' }}></div>
          <div style={{ position: 'absolute', bottom: '20%', left: '15%', width: '8px', height: '8px', background: '#8b5cf6', borderRadius: '50%' }}></div>
          
          <div style={{ position: 'absolute', top: '15%', right: '25%', width: '6px', height: '6px', background: '#fbbf24', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', top: '35%', right: '10%', width: '12px', height: '12px', background: '#60a5fa', borderRadius: '2px', transform: 'rotate(20deg)' }}></div>
          <div style={{ position: 'absolute', bottom: '25%', right: '15%', width: '10px', height: '10px', background: '#34d399', borderRadius: '50%' }}></div>
          
          {/* Checkmark Circle */}
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', background: '#6366f1', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>

        {/* Text */}
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', marginBottom: '16px', textAlign: 'center' }}>
          You're all set! 🎉
        </h1>
        <p style={{ fontSize: '16px', color: '#4a4a4a', lineHeight: '1.5', textAlign: 'center', maxWidth: '280px' }}>
          Ramesh's account is created and the medicine plan is ready. We'll start tracking from Day 0.
        </p>

      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/son')}
          style={{ 
            width: '100%', padding: '16px', fontSize: '16px', fontWeight: '600', 
            borderRadius: '12px', background: '#6366f1', color: 'white', border: 'none', cursor: 'pointer'
          }}
        >
          Go to Dashboard
        </button>
        
        <button 
          onClick={() => navigate('/add-loved-one')}
          style={{ 
            background: 'transparent', border: 'none', color: '#6366f1', 
            fontSize: '16px', fontWeight: '600', cursor: 'pointer', padding: '8px'
          }}
        >
          Add another family member
        </button>
      </div>

    </div>
  );
}
