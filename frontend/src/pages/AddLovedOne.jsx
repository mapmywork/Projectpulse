import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddLovedOne() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // Trigger the WhatsApp welcome message to the patient (Ramesh)
    try {
      await fetch('/api/send-welcome', { method: 'POST' });
    } catch (error) {
      console.error('Failed to send welcome message', error);
    }
    // In a real app, save to backend here
    localStorage.setItem('lovedOneOnboarded', 'true');
    navigate('/add-medicines');
  };

  return (
    <div className="page" style={{ padding: '24px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', marginTop: '16px' }}>
        <div style={{ cursor: 'pointer', paddingRight: '16px' }} onClick={() => navigate('/login')}>
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>←</span>
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 auto', paddingRight: '40px' }}>
          Add your loved one
        </h1>
      </div>

      {/* Avatar Section */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', position: 'relative' }}>
        <div style={{ 
          width: '120px', height: '120px', borderRadius: '50%', background: '#ffe6e6', 
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden'
        }}>
          {/* Avatar graphic placeholder matching the image */}
          <div style={{ width: '80%', height: '80%', background: '#8eb3f9', borderTopLeftRadius: '50%', borderTopRightRadius: '50%' }}>
            <div style={{ 
              width: '40px', height: '40px', background: '#f5c5a3', borderRadius: '50%', 
              margin: '-20px auto 0' 
            }}></div>
          </div>
        </div>
        <div style={{
          position: 'absolute', bottom: '0', right: 'calc(50% - 60px)', 
          width: '32px', height: '32px', borderRadius: '50%', background: 'white', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleContinue} style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#4a5568' }}>Full name</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)}
            placeholder="Ramesh Kumar"
            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontSize: '16px' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#4a5568' }}>Phone number</label>
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white' }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>🇮🇳</span>
            <span style={{ borderRight: '1px solid #e2e8f0', paddingRight: '12px', marginRight: '12px', color: '#1a202c', fontWeight: '500' }}>+91</span>
            <input 
              type="tel" 
              value={phone} 
              onChange={e => setPhone(e.target.value)}
              placeholder="98XXXXXXXX"
              style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '16px', outline: 'none' }}
              required
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#4a5568' }}>Age</label>
          <input 
            type="number" 
            value={age} 
            onChange={e => setAge(e.target.value)}
            placeholder="56"
            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontSize: '16px' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#4a5568' }}>City</label>
          <input 
            type="text" 
            value={city} 
            onChange={e => setCity(e.target.value)}
            placeholder="Kanpur"
            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontSize: '16px' }}
            required
          />
        </div>
        
        <div style={{ flex: 1 }}></div>

        <button type="submit" disabled={isSubmitting} className="btn" style={{ 
          width: '100%', padding: '16px', fontSize: '16px', fontWeight: '600', borderRadius: '12px', background: isSubmitting ? '#a5b4fc' : '#6366f1', color: 'white', marginBottom: '20px', cursor: isSubmitting ? 'not-allowed' : 'pointer'
        }}>
          {isSubmitting ? 'Sending...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
