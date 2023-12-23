"use client";
import { Button } from 'flowbite-react';

interface UserPromptsProps{
  prompts: string[];
}

const UserPrompts = ({prompts}: UserPromptsProps) => {
  return (
    <>
    <div>
      Existing User Prompts
    </div>
    <ul className="h-lvh border-solid border-4 rounded-md">
      {prompts.map(p => (<div className="flex space-between">
        <h5 className="text-1xl font-bold tracking-tight text-gray-900 dark:text-white">
          {p}
        </h5>
        <div className="flex flex-wrap gap-2">
          <Button pill>Load</Button>
          <Button pill color="blue">Create Deployment</Button>
        </div>
      </div>
      ))}
    </ul>
    </>
  );
}

export default UserPrompts;