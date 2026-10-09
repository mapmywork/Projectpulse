import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/Splash';
import AddLovedOne from './pages/AddLovedOne';
import AddMedicines from './pages/AddMedicines';
import ConfirmSchedule from './pages/ConfirmSchedule';
import BookTest from './pages/BookTest';
import SetupComplete from './pages/SetupComplete';
import SonDashboard from './pages/SonDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorPatientDetail from './pages/DoctorPatientDetail';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import Chat from './pages/Chat';
import PatientWhatsApp from './pages/PatientWhatsApp';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import ReportDetail from './pages/ReportDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/add-loved-one" element={<AddLovedOne />} />
        <Route path="/add-medicines" element={<AddMedicines />} />
        <Route path="/confirm-schedule" element={<ConfirmSchedule />} />
        <Route path="/book-test" element={<BookTest />} />
        <Route path="/setup-complete" element={<SetupComplete />} />
        <Route path="/son" element={<SonDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/doctor/patient/:id" element={<DoctorPatientDetail />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/patient-whatsapp" element={<PatientWhatsApp />} />
        <Route path="/coordinator" element={<CoordinatorDashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/:id" element={<ReportDetail />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
