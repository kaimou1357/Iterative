import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUp from './SignUp';
import SignIn from './SignIn';
import AuthContext from './AuthContext';
import GuestAuth from './GuestAuth';

const Auth = () => {
    const { isAuthenticated, isGuest } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated || isGuest) {
          navigate('/wireframe-tool');
        }
      }, [isAuthenticated, isGuest, navigate]);

    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100 gap-3">
          <SignUp />
          <GuestAuth />
          <SignIn />
        </div>
    );
};

export default Auth;