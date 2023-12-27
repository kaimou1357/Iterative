"use client";

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

  const {setProjectStateId, setDeploymentModalOpen} = useDeploymentStore();

  const onCreateDeploymentClick = (projectStateId: number) => {
    setProjectStateId(projectStateId);
    setDeploymentModalOpen(true);
  }
  return (
    <div>
      <div className="mb-3 ">Existing User Prompts</div>
      <ul className=" h-screen  rounded-md ">
        {projectStates.map((p, idx) => (
          <div key={idx} className="flex flex-col">
            <h5 className="text-1xl truncate font-bold tracking-tight text-gray-900 dark:text-white">
              {p.prompt}
            </h5>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onLoadClick(p.reactCode)}
                className="my-auto rounded-full bg-green-500 p-3 text-sm text-white"
              >
                Load
              </button>
              {authenticated ? (
                <button onClick={() => onCreateDeploymentClick(p.id)} className="my-auto rounded-full bg-purple-700 p-3 text-sm text-white dark:bg-cyan-500 ">
                  Create Deployment
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default UserPrompts;
