import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/auth.service';

const AuthGuard = () => {
  const isAuth = authService.isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
