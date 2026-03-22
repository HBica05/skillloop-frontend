import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="text-center mt-5">Loading...</div>;
  return token ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;