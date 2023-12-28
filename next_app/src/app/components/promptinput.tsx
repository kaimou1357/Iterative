"use client";
import { ChangeEvent, useState } from "react";
import {
  Button,
  DarkThemeToggle,
  Flowbite,
  Label,
  Modal,
  Spinner,
  Textarea,
} from "flowbite-react";
import Link from "next/link";

interface PromptInputProps {
  user: any;
  onPromptSubmit: (prompt: string) => void;
  onProjectReset: () => void;
  onProjectSaveClicked: (openModal: boolean) => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const PromptInput = ({
  user,
  onProjectReset,
  onPromptSubmit,
  onProjectSaveClicked,
  loading,
  isAuthenticated,
}: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const onChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setPrompt(event.currentTarget.value);
  };

  const handleSaveProject = () => {
    if(!user) {
      setShowLoginModal(true)
    }
    else onProjectSaveClicked(true)
  }

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
            <Button>
              <Spinner aria-label="Spinner button example" size="sm" />
              <span className="pl-3">Loading...</span>
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex flex-row gap-1 ">
              <Button
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
            
                <Button
                color="success"
                onClick={handleSaveProject}
              >
                Save Project
                </Button>
            </div>
          </div>
        )}
      </div>
      {showLoginModal && <Modal dismissible show={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <Modal.Header>Please login</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Please login first to save your project.
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
    </Flowbite>
  );
};

export default PromptInput;
