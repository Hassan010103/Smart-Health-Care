
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isAllowed: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAllowed, redirectTo = '/' }) => {
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
