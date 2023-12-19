import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from './config';
import AuthContext from './AuthContext';

const DeploymentList = () => {
    const [deployments, setDeployments] = useState([]);
    
    const { isAuthenticated } = useContext(AuthContext);

    const fetchInfo = () => {
      axios.get(`${API_BASE_URL}/deployments`)
        .then((response) => {
          setDeployments(response.data.deployments);
        })
        .catch((error) => {
          console.error('Error Fetching Deployments');
        });
    }

    useEffect(() => {
      if (isAuthenticated) {
        fetchInfo();
      }

    }, [isAuthenticated]);

    return (
        <table className="table">
          <thead className="thead-dark">
          <tr>
            <th scope="col">Deployment Name</th>
            <th scope="col">Passcode</th>
            <th scope="col">Access</th>
          </tr>
          </thead>
          <tbody>
            { deployments.map((deployment, idx) => {
              return (
                <tr key={idx}>
                  <th scope = "row">{deployment.name}</th>
                  <td>{deployment.password}</td>
                  <td><Link to={`/deployments/${deployment.id}`} relative="path">Open</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
    );
};

export default DeploymentList;