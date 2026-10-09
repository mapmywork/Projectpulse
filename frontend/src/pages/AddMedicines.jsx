import { useNavigate } from 'react-router-dom';

export default function AddMedicines() {
  const navigate = useNavigate();

  const handleComplete = () => {
    // Navigate to confirm schedule after "uploading"
    navigate('/confirm-schedule');
  };

  return (
    <div className="page" style={{ padding: '24px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ marginTop: '16px', marginBottom: '32px' }}>
        <div style={{ cursor: 'pointer', marginBottom: '24px' }} onClick={() => navigate('/add-loved-one')}>
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>←</span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', marginBottom: '12px' }}>
          Let's add his medicines
        </h1>
        <p style={{ fontSize: '16px', color: '#4a4a4a', lineHeight: '1.5' }}>
          Upload a photo of the latest prescription. We'll use this to create his reminder schedule.
        </p>
      </div>

      {/* Prescription Image Placeholder */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '40px'
      }}>
        <div style={{
          width: '100%',
          aspectRatio: '3/4',
          background: '#f3f4f6',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed #d1d5db',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            width: '80%', height: '80%', background: 'white', borderRadius: '8px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column',
            padding: '20px'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', borderBottom: '2px solid #f3f4f6', paddingBottom: '8px' }}>
              ℞ Prescription
            </div>
            <div style={{ width: '60%', height: '8px', background: '#e5e7eb', marginBottom: '12px', borderRadius: '4px' }}></div>
            <div style={{ width: '80%', height: '8px', background: '#e5e7eb', marginBottom: '12px', borderRadius: '4px' }}></div>
            <div style={{ width: '70%', height: '8px', background: '#e5e7eb', marginBottom: '12px', borderRadius: '4px' }}></div>
            <div style={{ width: '90%', height: '8px', background: '#e5e7eb', marginBottom: '12px', borderRadius: '4px' }}></div>
            
            <div style={{ marginTop: 'auto', width: '40%', height: '8px', background: '#cbd5e1', borderRadius: '4px', alignSelf: 'flex-end' }}></div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
        <button 
          onClick={handleComplete}
          style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            width: '100%', padding: '16px', fontSize: '16px', fontWeight: '600', 
            borderRadius: '12px', background: '#6366f1', color: 'white', border: 'none', cursor: 'pointer'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
          Upload Photo
        </button>
        
        <button 
          onClick={handleComplete}
          style={{ 
            background: 'transparent', border: 'none', color: '#6366f1', 
            fontSize: '16px', fontWeight: '600', cursor: 'pointer', padding: '8px'
          }}
        >
          Or enter manually
        </button>
      </div>

    </div>
  );
}
