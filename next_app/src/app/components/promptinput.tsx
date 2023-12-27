"use client";
import { ChangeEvent, useState } from "react";
import {
  Button,
  DarkThemeToggle,
  Flowbite,
  Label,
  Spinner,
  Textarea,
} from "flowbite-react";

interface PromptInputProps {
  onPromptSubmit: (prompt: string) => void;
  onProjectReset: () => void;
  onProjectSaveClicked: (openModal: boolean) => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const PromptInput = ({
  onProjectReset,
  onPromptSubmit,
  onProjectSaveClicked,
  loading,
  isAuthenticated,
}: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");

  const onChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setPrompt(event.currentTarget.value);
  };

  return (
    <Flowbite>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="prompt" value="What do you want to build?" />
        </div>
        <Textarea
          className="mb-2"
          id="prompt"
          placeholder="Tell us your thoughts"
          required
          rows={4}
          onChange={onChange}
          value={prompt}
        />
        {loading ? (
          <div>
            <Button className="bg-blue-500">
              <Spinner aria-label="Spinner button example" size="sm" />
              <span className="pl-3">Loading...</span>
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex flex-row gap-1 ">
              <button
                onClick={() => onPromptSubmit(prompt)}
                className="my-auto rounded-full bg-blue-500 p-3 text-sm text-white"
              >
                Generate Code
              </button>

              <button
                onClick={() => onProjectReset()}
                className="my-auto flex flex-row gap-1 rounded-full bg-red-500 p-3 text-white"
              >
                Reset
              </button>
              {isAuthenticated ? (
                <button
                  onClick={() => onProjectSaveClicked(true)}
                  className="my-auto flex flex-row gap-1 rounded-full bg-green-700 p-3 text-white"
                >
                  Save Project
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </Flowbite>
  );
};

export default PromptInput;
