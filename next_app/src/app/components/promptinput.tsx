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
          <Label htmlFor="prompt" className="font-bold text-xl" value="What do you want to build?" />
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
              <Button color="blue"
                onClick={() => onPromptSubmit(prompt)}
                size={'sm'}
              >
                Generate Code
                </Button>

              <Button color="failure"
                onClick={() => onProjectReset()}
              >
                Reset
                </Button>
              {isAuthenticated ? (
                  <Button
                  color="success"
                  onClick={() => onProjectSaveClicked(true)}
                >
                  Save Project
                  </Button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </Flowbite>
  );
};

export default PromptInput;
