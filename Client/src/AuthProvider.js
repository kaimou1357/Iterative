import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import axios from 'axios';
import { API_BASE_URL } from './config';

const AuthProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const checkAuthStatus = () => {
    console.log('Checking auth status');
    
    axios.defaults.withCredentials = true;

    axios.get(`${API_BASE_URL}/auth-status`)
      .then((response) => {
        console.log('user is signed in:', response.data.isAuthenticated);
        console.log('user is guest:', response.data.isGuest);
        setIsAuthenticated(response.data.isAuthenticated);
        setIsGuest(response.data.isGuest);
      })
      .catch((error) => {
        console.error('Error checking authentication status:', error);
        // Handle error as needed
      });
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);
  
  const signIn = (guest = false) => {
    if (guest) {
      console.log('Signing in as guest');
      setIsGuest(true);
    } else {
      console.log('Signing in as user');
      setIsAuthenticated(true);
      setIsGuest(false); // Make sure this is set to false
    }
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setIsGuest(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isGuest, signIn, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
