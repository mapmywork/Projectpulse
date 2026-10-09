import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SonDashboard from './pages/SonDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorPatientDetail from './pages/DoctorPatientDetail';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import Chat from './pages/Chat';
import PatientWhatsApp from './pages/PatientWhatsApp';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/son" element={<SonDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/doctor/patient/:id" element={<DoctorPatientDetail />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/patient-whatsapp" element={<PatientWhatsApp />} />
        <Route path="/coordinator" element={<CoordinatorDashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
