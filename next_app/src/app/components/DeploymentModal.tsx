"use client";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useDeploymentStore, useToolStore } from "../tool/toolstate";
import { API_BASE_URL } from "./config";
import axios from "axios";

export const DeploymentModal = () => {
  const {
    passcode,
    deploymentName,
    setPasscode,
    setDeploymentName,
    projectStateId,
    modalOpen,
    setDeploymentModalOpen,
  } = useDeploymentStore();

  const { showToast } = useToolStore();

  const onCloseModal = () => {
    setDeploymentName("");
    setPasscode("");
    setDeploymentModalOpen(false);
  };

  const handleCreateDeployment = () => {
    axios
      .post(`${API_BASE_URL}/deployments`, {
        project_state_id: projectStateId,
        deployment_name: deploymentName,
        passcode: passcode,
      })
      .then((_) => {
        onCloseModal();
        showToast("Deployment Created Successfully");
      });
  };

  return (
    <>
      <Modal show={modalOpen} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Create a New Deployment
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Deployment Name" />
              </div>
              <TextInput
                id="name"
                placeholder="My First Deployment!"
                value={deploymentName}
                onChange={(event) => {
                  setDeploymentName(event.target.value);
                }}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Passcode" />
              </div>
              <TextInput
                id="password"
                required
                placeholder="123456"
                value={passcode}
                onChange={(event) => {
                  setPasscode(event.target.value);
                }}
              />
            </div>
            <div className="flex justify-between"></div>
            <div className="w-full">
              <Button onClick={handleCreateDeployment}>
                Create Deployment
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
