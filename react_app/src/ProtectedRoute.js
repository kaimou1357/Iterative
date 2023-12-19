import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component }) => {
  const authenticated = localStorage.getItem("authenticated");

  if (authenticated) {
    return <Component />
  } else {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
