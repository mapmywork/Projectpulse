import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BookTest() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      await fetch((import.meta.env.VITE_API_URL || '') + '/api/send-appointment', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    
    // Navigate to setup complete screen
    navigate('/setup-complete');
  };

  return (
    <div className="page" style={{ padding: '24px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ marginTop: '16px', marginBottom: '32px' }}>
        <div style={{ cursor: 'pointer', marginBottom: '24px' }} onClick={() => navigate('/confirm-schedule')}>
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>←</span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', marginBottom: '12px' }}>
          Let's find your starting point
        </h1>
        <p style={{ fontSize: '16px', color: '#4a4a4a', lineHeight: '1.5' }}>
          Book a home test for HbA1c.<br />
          This helps us measure progress over 90 days.
        </p>
      </div>

      {/* Info Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        
        {/* Test Details Card */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          padding: '16px', borderRadius: '16px', border: '1px solid #e5e7eb',
          background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          <div style={{ 
            width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
              <path d="M8 14h.01"></path>
              <path d="M12 14h.01"></path>
              <path d="M16 14h.01"></path>
              <path d="M8 18h.01"></path>
              <path d="M12 18h.01"></path>
              <path d="M16 18h.01"></path>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>
              HbA1c Test
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.4' }}>
              Home sample collection<br/>
              ₹399 (partner lab)
            </div>
          </div>
        </div>

        {/* Slot Details Card */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          padding: '16px', borderRadius: '16px', border: '1px solid #e5e7eb',
          background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          <div style={{ 
            width: '48px', height: '48px', borderRadius: '12px', background: '#ede9fe', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
              <circle cx="12" cy="15" r="3"></circle>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>
              Earliest slot
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Tomorrow, 10 AM - 12 PM
            </div>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
        <button 
          onClick={handleComplete}
          disabled={isSubmitting}
          style={{ 
            width: '100%', padding: '16px', fontSize: '16px', fontWeight: '600', 
            borderRadius: '12px', background: isSubmitting ? '#a5b4fc' : '#6366f1', color: 'white', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Booking...' : 'Book Test'}
        </button>
        
        <button 
          onClick={handleComplete}
          style={{ 
            background: 'transparent', border: 'none', color: '#6b7280', 
            fontSize: '16px', fontWeight: '600', cursor: 'pointer', padding: '8px'
          }}
        >
          Skip for now
        </button>
      </div>

    </div>
  );
}
