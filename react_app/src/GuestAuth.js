import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import { API_BASE_URL } from './config';

const GuestAuth = () => {
    const { signIn } = useContext(AuthContext);
    const [guestAuthSuccess, setGuestAuthSuccess] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
      if (guestAuthSuccess) {
        signIn(true);
      }
    }, [guestAuthSuccess, signIn]);

    const handleGuestAuth = () => {
      axios.post(`${API_BASE_URL}/guest-auth`)
        .then((response) => {
          if (response.data.status === 'success') {
            setGuestAuthSuccess(true);
          } else {
            setMessage(response.data.message);
          }
        })
        .catch(() => {
          setMessage('Guest auth failed. Please try again.');
        });
    };

    return (
        <>
            <button type="button" className="btn btn-secondary ms-3" onClick={handleGuestAuth}>Continue as Guest</button>
            {message && <p className="mt-3 text-danger">{message}</p>}
        </>
    );
};

export default GuestAuth;
