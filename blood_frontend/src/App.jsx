import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Donations from './pages/Donations';
import Requests from './pages/Requests';
import RequestBlood from './pages/RequestBlood';
import RecordDonation from './pages/RecordDonation';
import Donors from './pages/Donors';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="container page">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
        <Route path="/donations" element={<PrivateRoute><Donations /></PrivateRoute>} />
        <Route path="/requests" element={<PrivateRoute><Requests /></PrivateRoute>} />
        <Route path="/request-blood" element={<PrivateRoute><RequestBlood /></PrivateRoute>} />
        <Route path="/record-donation" element={
          <PrivateRoute roles={['admin', 'staff', 'donor']}><RecordDonation /></PrivateRoute>
        } />
        <Route path="/donors" element={
          <PrivateRoute roles={['admin', 'staff']}><Donors /></PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
