"use client";
import { ChangeEvent, useState } from "react";
import { Label, Textarea } from "flowbite-react";
import { Button, Spinner } from "flowbite-react";

interface PromptInputProps {
  onPromptSubmit: (prompt: string) => void;
  loading: boolean;
}

const PromptInput = ({ onPromptSubmit, loading }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");

  const onChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setPrompt(event.currentTarget.value);
  };

  return (
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
        <Button>
          <Spinner aria-label="Spinner button example" size="sm" />
          <span className="pl-3">Loading...</span>
        </Button>
      ) : (
        <Button onClick={() => onPromptSubmit(prompt)}>Generate Code</Button>
      )}
    </div>
  );
};

export default PromptInput;
