import React, { useState, useEffect } from 'react';

const PasscodeModal = ({ isOpen, onPasswordSubmit, invalidPasscode }) => {
  const [passcode, setPasscode] = useState('');

  return (
    <div className={`modal fade ${isOpen ? 'show d-block' : 'd-none'}`} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Enter Password to View</h5>
          </div>
          <div className="modal-body"> 
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
              />
              <button className="btn btn-primary" onClick={() => onPasswordSubmit(passcode)}>Submit Passcode</button>
              
            </div>
          </div>
          <div className="modal-footer">
            {invalidPasscode ? <div className="mr-auto">Invalid Password</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasscodeModal;