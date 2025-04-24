import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectIsAuthenticated } from '../../../features/auth/authSlice';
import { signinURL } from '../../../routes';

export const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  if (!isAuthenticated) return <Navigate to={signinURL} />;

  return <Outlet />;
};
