"use client";

import { Button, Modal } from "flowbite-react";
import { ProjectState, useDeploymentStore } from "../tool/toolstate";
import { useState } from "react";
import Link from "next/link";

interface UserPromptsProps {
  user: any;
  projectStates: ProjectState[];
  authenticated: boolean;
  onLoadClick: (reactCode: string | null) => void;
}

const UserPrompts = ({
  user,
  projectStates,
  authenticated,
  onLoadClick,
}: UserPromptsProps) => {
  const { setProjectStateId, setDeploymentModalOpen } = useDeploymentStore();
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const onCreateDeploymentClick = (projectStateId: number) => {
    if(!user) setShowLoginModal(true)
    else {
      setProjectStateId(projectStateId);
      setDeploymentModalOpen(true);
    }
  };
  return (
    <div className="w-full">
      <div className="mb-3 font-bold text-xl">Existing User Prompts</div>
      <ul className="max-h-[480px] w-full flex flex-col gap-4 overflow-y-auto rounded-md ">
        {projectStates.map((p, idx) => (
          <div key={idx} className="flex flex-col">
            <h5 className="text-1xl truncate font-bold tracking-tight text-gray-900 dark:text-white">
              {p.prompt}
            </h5>
            <div className="flex flex-wrap gap-1">
              <Button
                onClick={() => onLoadClick(p.reactCode)}
                color="success"
                size={'sm'}
              >
                Load
              </Button>
              
              <Button
                onClick={() => onCreateDeploymentClick(p.id)}
                color="purple"
                size={'sm'}
                // className="my-auto rounded-full bg-purple-700 p-3 text-sm text-white dark:bg-cyan-500 "
              >
                Create Deployment
              </Button>
            </div>
          </div>
        ))}
      </ul>
      {showLoginModal && <Modal dismissible show={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <Modal.Header>Please login</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Please login first to create a deployment.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Link href={'/login'}><Button color="blue">Login</Button></Link>
          <Button color="failure" onClick={() => setShowLoginModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>}
    </div>
  );
};

export default UserPrompts;
