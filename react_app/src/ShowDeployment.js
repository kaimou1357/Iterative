import React from 'react';
import { useParams } from 'react-router-dom';

const ShowDeployment = () => {
  let { id } = useParams();
  console.log(id);
  return (
    <div>Hello World</div>
  );
};

export default ShowDeployment;