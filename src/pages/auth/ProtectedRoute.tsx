import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '../../app/store';
import { signinURL } from '../../routes/';

const ProtectedRoute = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  if (!token) return <Navigate to={signinURL} />;

  return <Outlet />;
};

export default ProtectedRoute;