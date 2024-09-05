import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuthenticated = document.cookie.includes('SessionID');
  console.log(document.cookie.includes('SessionID'))
  console.log('isAuthenticated', isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
