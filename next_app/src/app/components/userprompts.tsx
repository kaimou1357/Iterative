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
          <div key={idx} className="flex flex-col">
            <h5 className="text-1xl truncate font-bold tracking-tight text-gray-900 dark:text-white">
              {p}
            </h5>

            <div className="flex flex-wrap gap-2">
              <button className="my-auto rounded-full bg-green-500 p-3 text-sm text-white">
                Load
              </button>
              <button className="my-auto rounded-full bg-purple-700 p-3 text-sm text-white dark:bg-cyan-500 ">
                Create Deployment
              </button>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default UserPrompts;
