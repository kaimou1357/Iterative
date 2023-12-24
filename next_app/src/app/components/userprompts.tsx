"use client";
import { Button } from "flowbite-react";

interface UserPromptsProps {
  prompts: string[];
}

const UserPrompts = ({ prompts }: UserPromptsProps) => {
  return (
    <div>
      <div className="mb-3 ">Existing User Prompts</div>
      <ul className=" h-screen  rounded-md ">
        {prompts.map((p, idx) => (
          <div key={idx} className="space-between flex">
            <h5 className="text-1xl font-bold tracking-tight text-gray-900 dark:text-white">
              {p}
            </h5>

            <div className="flex flex-wrap gap-2">
              <Button pill>Load</Button>
              <Button pill color="blue">
                Create Deployment
              </Button>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default UserPrompts;
