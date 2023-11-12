import React from 'react';

const VersionBadge = () => {
  return (
    <div className="position-fixed bottom-0 end-0 m-2">
      <div className="bg-danger text-white p-2 d-flex align-items-center">
        <span className="me-2">
          <i className="bi bi-exclamation-triangle"></i>
        </span>
        Pre-Alpha
      </div>
    </div>
  );
};

export default VersionBadge;
