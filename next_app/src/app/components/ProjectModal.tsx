"use client";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useToolStore } from "../tool/toolstate";
import { API_BASE_URL } from "./config";
import axios from "axios";
import { useState } from "react";

interface ProjectModalProps {
  projectId: string | null;
}

export const ProjectModal = ({ projectId }: ProjectModalProps) => {
  const [projectName, setProjectName] = useState<string>("");

  const { showToast, setOpenProjectModal, openProjectModal } = useToolStore();

  const handleSaveProject = () => {
    axios
      .patch(`${API_BASE_URL}/projects`, {
        project_id: projectId,
        project_name: projectName,
      })
      .then((_) => {
        onCloseModal();
        showToast("Project Saved Successfully");
      });
  };

  const onCloseModal = () => {
    setProjectName("");
    setOpenProjectModal(false);
  };

  return (
    <>
      <Modal show={openProjectModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Save your project
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="project" value="Project Name" />
              </div>
              <TextInput
                id="name"
                placeholder="My First Project"
                value={projectName}
                onChange={(event) => {
                  setProjectName(event.target.value);
                }}
                required
              />
            </div>
            <div className="flex justify-between"></div>
            <div className="w-full">
              <Button onClick={handleSaveProject}>Save Project</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
