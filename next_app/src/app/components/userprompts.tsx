"use client";

import { Button, Modal } from "flowbite-react";
import { ProjectState, useDeploymentStore } from "../tool/toolstate";

interface UserPromptsProps {
  projectStates: ProjectState[];
  authenticated: boolean;
  onLoadClick: (reactCode: string | null) => void;
}

const UserPrompts = ({
  projectStates,
  authenticated,
  onLoadClick,
}: UserPromptsProps) => {
  const { setProjectStateId, setDeploymentModalOpen } = useDeploymentStore();

  const onCreateDeploymentClick = (projectStateId: number) => {
    setProjectStateId(projectStateId);
    setDeploymentModalOpen(true);
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
              {authenticated ? (
                <Button
                  onClick={() => onCreateDeploymentClick(p.id)}
                  color="purple"
                  size={'sm'}
                  // className="my-auto rounded-full bg-purple-700 p-3 text-sm text-white dark:bg-cyan-500 "
                >
                  Create Deployment
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default UserPrompts;
