import React, { useState, useEffect } from "react";
import axios from "axios";

import { API_BASE_URL } from "./config";

const DeploymentModal = ({ isOpen, onClose, projectStateId }) => {
  const [newDeploymentName, setNewDeploymentName] = useState("");
  const [newDeploymentPasscode, setNewDeploymentPasscode] = useState("");
  const [deploymentCreated, setDeploymentCreated] = useState(false);

  const handleCreateDeployment = () => {
    axios
      .post(`${API_BASE_URL}/deployments`, {
        project_state_id: projectStateId,
        deployment_name: newDeploymentName,
        passcode: newDeploymentPasscode,
      })
      .then((_) => {
        setDeploymentCreated(true);
        setTimeout(() => {
          resetState();
          onClose();
        }, 2000);
      });
  };

  const resetState = () => {
    setNewDeploymentName("");
    setNewDeploymentPasscode("");
    setDeploymentCreated(false);
  };

  return (
    <div
      className={`modal fade ${isOpen ? "show d-block" : "d-none"}`}
      tabIndex="-1"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Deployment</h5>
          </div>
          <div className="modal-body">
            <form>
              <div class="form-group">
                <label for="name" class="col-form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={newDeploymentName}
                  onChange={(e) => setNewDeploymentName(e.target.value)}
                />
              </div>
              <div class="form-group">
                <label for="name" class="col-form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Passcode"
                  value={newDeploymentPasscode}
                  onChange={(e) => setNewDeploymentPasscode(e.target.value)}
                />
              </div>
            </form>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateDeployment}
              >
                Create Deployment
              </button>
              {deploymentCreated ? (
                <div>Deployment Created Successfully!</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentModal;
