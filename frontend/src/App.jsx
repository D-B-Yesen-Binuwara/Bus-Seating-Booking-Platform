import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/user/UserDashboard';
import StaffDashboard from './pages/admin/StaffDashboard';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'staff' ? '/admin' : '/user'} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={user.role === 'staff' ? '/admin' : '/user'} replace /> : <Register />} />
      <Route path="/user/*" element={user && user.role !== 'staff' ? <UserDashboard /> : <Navigate to="/login" replace />} />
      <Route path="/admin/*" element={user && user.role === 'staff' ? <StaffDashboard /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
