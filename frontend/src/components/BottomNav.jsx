import { useNavigate } from 'react-router-dom';

export default function BottomNav({ role }) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="bottom-nav">
      <button onClick={() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const route = user ? user.role.toLowerCase() : '';
        navigate(`/${route}`);
      }}>
        <span>🏠</span>
        <span>Home</span>
      </button>
      <button onClick={() => navigate('/chat')}>
        <span>💬</span>
        <span>Chat</span>
      </button>
      <button onClick={() => navigate('/settings')}>
        <span>⚙️</span>
        <span>Settings</span>
      </button>
    </div>
  );
}
