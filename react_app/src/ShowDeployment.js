import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import LiveCodeEditor from './LiveCodeEditor';
import axios from 'axios';
import { API_BASE_URL } from './config';

const ShowDeployment = () => {
  const [state, setState] = useState({
    loading: true,
    deployment: false
  });

  const { id } = useParams();
  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = () => {
    axios.get(`${API_BASE_URL}/deployments/${id}`)
      .then((response) => {
        setState({loading: false, deployment: response.data.deployment});
      })
      .catch((error) => {
        console.error('Error Fetching Deployment');
      });
  }
  const { loading, deployment } = state;
  const reactCode = deployment.react_code;

  return (
    <div style = {{height:"100vh"}}>
      <LiveCodeEditor code={`export default ${reactCode}`} css="" cssFramework="DAISYUI" />
     </div>
  );
};

export default ShowDeployment;