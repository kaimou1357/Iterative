import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import axios from 'axios';
import { API_BASE_URL } from './config';

const AuthProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkAuthStatus = () => {
    console.log('Checking auth status');
    
    axios.defaults.withCredentials = true;

    axios.get(`${API_BASE_URL}/auth-status`)
      .then((response) => {
        console.log('user is signed in:', response.data.isAuthenticated);
        console.log('user is guest:', response.data.isGuest);
        setIsAuthenticated(response.data.isAuthenticated);
      })
      .catch((error) => {
        console.error('Error checking authentication status:', error);
        // Handle error as needed
      });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuthStatus();
    }
  }, []);
  
  const signIn = (guest = false) => {
    console.log('Signing in as user');
    setIsAuthenticated(true);
    localStorage.setItem("authenticated", "true");
    navigate('/wireframe-tool');
  };

  const signOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("authenticated");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
