import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import { API_BASE_URL } from './config';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const { signIn: signIn } = useContext(AuthContext);

  useEffect(() => {
    if (signUpSuccess) {
        setMessage('Registration successful. Signing you in...');
        signIn();
    }
  }, [signUpSuccess]);

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    axios.post(`${API_BASE_URL}/sign-up`, { email, password })
      .then((response) => {
        if (response.data.status === 'success') {
            setSignUpSuccess(true);
        } else {
          setMessage(response.data.message);
        }
      })
      .catch((error) => {
        // Check if the error response contains a message from the server
        if (error.response && error.response.data && error.response.data.message) {
            setMessage(error.response.data.message);
        } else {
            setMessage('Registration failed. Please try again.');
        }
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center">Sign Up</h1>
              <form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="button" className="btn btn-primary" onClick={handleSignUp}>Sign Up</button>
                {message && <p className="mt-3 text-danger">{message}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
