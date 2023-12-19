import React  from 'react';

import SignUp from './SignUp';
import SignIn from './SignIn';

const Auth = () => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100 gap-3">
          <SignUp />
          <SignIn />
        </div>
    );
};

export default Auth;