import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import { API_BASE_URL } from './config';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { signIn } = useContext(AuthContext);
  const [signInSuccess, setSignInSuccess] = useState(false);

  useEffect(() => {
    if (signInSuccess) {
        signIn(); // Call the signIn function from the context
    }
  }, [signInSuccess, signIn]);

  const handleSignIn = () => {
    axios.post(`${API_BASE_URL}/sign-in`, { email, password })
      .then((response) => {
        if (response.data.status === 'success') {
            setSignInSuccess(true);
        } else {
          setMessage(response.data.message);
        }
      })
      .catch((error) => {
        setMessage('Sign in failed. Please try again.');
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center">Sign In</h1>
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
                <button type="button" className="btn btn-primary" onClick={handleSignIn}>Sign In</button>
                {message && <p className="mt-3 text-danger">{message}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
