import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const ProtectedRoute = ({ component: Component }) => {
  const { isAuthenticated, isGuest } = useContext(AuthContext);

  if (isAuthenticated || isGuest ) {
    return <Component />
  } else {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
