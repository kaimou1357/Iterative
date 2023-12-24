"use client";
import { ChangeEvent, useRef, useState, forwardRef } from "react";
import { DarkThemeToggle, Flowbite, Label, Textarea } from "flowbite-react";
import { Button, Spinner } from "flowbite-react";
import Link from "next/link";

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
          <button type="button" className=" flex flex-row" disabled>
            <svg
              className="mr-3 h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </button>
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
                onClick={() => onPromptSubmit(prompt)}
                className="my-auto flex flex-row gap-3 rounded-full bg-red-500 p-3 text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Reset
              </button>
              <DarkThemeToggle className="rounded-full border px-3 py-3 dark:border-white" />
            </div>
          </div>
        )}
      </div>
    </Flowbite>
  );
};

export default PromptInput;
