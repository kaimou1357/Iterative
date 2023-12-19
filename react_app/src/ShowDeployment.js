import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import LiveCodeEditor from './LiveCodeEditor';
import axios from 'axios';
import AuthContext from './AuthContext';
import PassCodeModal from './PasscodeModal'
import { API_BASE_URL } from './config';

const ShowDeployment = () => {
  const [state, setState] = useState({
    loading: true,
    deployment: false,
  });

  const [openPasswordCollection, setOpenPasswordCollection] = useState(false);
  const [invalidPasscode, setInvalidPasscode] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  const { id } = useParams();
  useEffect(() => {
    if (isAuthenticated) {
      fetchInfo();
    }
  }, []);

  const fetchInfo = () => {
    axios.get(`${API_BASE_URL}/deployments/${id}`)
      .then((response) => {
        setState({loading: false, deployment: response.data.deployment});
      })
      .catch((error) => {
        setOpenPasswordCollection(true);
        console.error('Unauthenticated Deployment - showing Modal to collect password');
      });
  }

  const verifyPassword = (passcode) => {
    axios.get(`${API_BASE_URL}/deployments/${id}?passcode=${passcode}`)
      .then((response) => {
        setState({loading: false, deployment: response.data.deployment});
        setOpenPasswordCollection(false);
      })
      .catch((error) => {
        setInvalidPasscode(true);
        setOpenPasswordCollection(true);
        console.error('Passcode validation failed. Re-opening modal');
      });
  }

  const { deployment } = state;
  const reactCode = deployment.react_code;

  return (
    <div style = {{height:"100vh"}}>
      {openPasswordCollection ? <PassCodeModal isOpen={openPasswordCollection} onPasswordSubmit={verifyPassword} invalidPasscode={invalidPasscode}/>: null}
      <LiveCodeEditor code={`export default ${reactCode}`} css="" cssFramework="DAISYUI" />
   </div>
  );
};

export default ShowDeployment;