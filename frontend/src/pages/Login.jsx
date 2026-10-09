import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState(location.state?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    // Map email/password to the original backend access codes for the demo
    let code = '';
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPassword = password.toLowerCase().trim();
    
    if (normalizedEmail === 'son@gmail.com' && normalizedPassword === 'son2026') code = 'SON2026';
    else if (normalizedEmail === 'doctor@gmail.com' && normalizedPassword === 'doc2026') code = 'DOC2026';
    else if (normalizedEmail === 'coordinator@gmail.com' && normalizedPassword === 'coord2026') code = 'COORD2026';
    else {
      setError('Invalid email or password');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        
        // Son should go to the Add Loved One screen first
        if (data.role === 'son' || code === 'SON2026') {
          navigate('/add-loved-one');
        } else {
          navigate(`/${data.role}`);
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  return (
    <div className="page" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      padding: '40px 24px 30px' 
    }}>
      
      {/* Top Section */}
      <div>
        <div style={{ cursor: 'pointer', marginBottom: '20px' }} onClick={() => navigate('/')}>
          <span style={{ fontSize: '24px' }}>←</span>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px'
          }}>
            <div style={{ 
              width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)' }}>Pulse</span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a', marginBottom: '12px' }}>
            Welcome to Pulse
          </h1>
          <p style={{ fontSize: '16px', color: '#4a4a4a', lineHeight: '1.5', padding: '0 20px', marginBottom: '40px' }}>
            Help your loved ones manage diabetes every day.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Enter your Gmail ID</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            placeholder="e.g. son@gmail.com"
            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '16px' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? 'text' : 'password'}
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '16px', paddingRight: '48px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '16px' }}
              required
            />
            <div 
              onClick={() => setShowPassword(!showPassword)}
              style={{ 
                position: 'absolute', 
                right: '16px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                cursor: 'pointer',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </div>
          </div>
        </div>
        
        {error && <p style={{ color: 'var(--red)', fontSize: '14px', textAlign: 'center' }}>{error}</p>}
        
        <button type="submit" className="btn" style={{ 
          width: '100%', padding: '16px', fontSize: '16px', fontWeight: '600', borderRadius: '12px', background: '#6366f1', color: 'white', marginTop: '16px' 
        }}>
          Sign In
        </button>
      </form>

      {/* Bottom Section */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <p style={{ fontSize: '12px', color: '#6b7280', padding: '0 20px' }}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>

    </div>
  );
}
