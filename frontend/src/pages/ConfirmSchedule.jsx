import { useNavigate } from 'react-router-dom';

export default function ConfirmSchedule() {
  const navigate = useNavigate();

  const handleConfirm = () => {
    // Navigate to the book test screen after confirming the schedule
    navigate('/book-test');
  };

  const medicines = [
    { name: 'Metformin 500 mg', dosage: '1 tablet • Morning' },
    { name: 'Amlodipine 5 mg', dosage: '1 tablet • Night' },
    { name: 'Atorvastatin 10 mg', dosage: '1 tablet • Night' },
  ];

  return (
    <div className="page" style={{ padding: '24px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ marginTop: '16px', marginBottom: '24px' }}>
        <div style={{ cursor: 'pointer', marginBottom: '24px' }} onClick={() => navigate(-1)}>
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>←</span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', marginBottom: '12px' }}>
          Confirm medicine schedule
        </h1>
      </div>

      {/* Medicines List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {medicines.map((med, index) => (
          <div key={index} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderRadius: '16px', border: '1px solid #e5e7eb',
            background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>
                {med.name}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {med.dosage}
              </div>
            </div>
            <div style={{ color: '#6b7280', cursor: 'pointer', padding: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </div>
          </div>
        ))}

        <div style={{ marginTop: '8px' }}>
          <button style={{ 
            background: 'transparent', border: 'none', color: '#6366f1', 
            fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px',
            cursor: 'pointer', padding: '8px 0'
          }}>
            <span style={{ fontSize: '20px' }}>+</span> Add another medicine
          </button>
        </div>
      </div>

      {/* Action Button */}
      <div style={{ marginTop: '40px', marginBottom: '20px' }}>
        <button 
          onClick={handleConfirm}
          style={{ 
            width: '100%', padding: '16px', fontSize: '16px', fontWeight: '600', 
            borderRadius: '12px', background: '#6366f1', color: 'white', border: 'none', cursor: 'pointer'
          }}
        >
          Confirm Schedule
        </button>
      </div>

    </div>
  );
}
