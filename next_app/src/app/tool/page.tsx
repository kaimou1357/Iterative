"use client";

import React from "react";
import GenKodeChat from "../components/chat";
import io, { Socket } from "socket.io-client";
import { SOCKET_IO_URL } from "../components/config";
import LiveCodeEditor from "../components/LiveCodeEditor";
import { useEffect } from "react";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import PromptBox from "../components/userprompts";
import PromptInput from "../components/promptinput";
import { useToolStore } from "./toolstate";
import { useStytchUser } from "@stytch/nextjs";
import Link from "next/link";
import { DarkThemeToggle, Flowbite } from "flowbite-react";
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export default function Tool() {
  const {
    loading,
    setLoading,
    prompts,
    addPrompt,
    projectId,
    setProjectId,
    reactCode,
    setReactCode,
    messages,
    addMessage,
  } = useToolStore();
  const { user, isInitialized } = useStytchUser();

  useEffect(() => {
    socketInitializer();
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isInitialized]);

  async function socketInitializer() {
    socket = io(SOCKET_IO_URL);

    socket.on("server_response", (response: any) => {
      addMessage(response);
    });

    socket.on("server_code", (response: any) => {
      setLoading(false);
      setReactCode(response);
    });

    socket.on("project_id", (projectId: any) => {
      setProjectId(projectId);
    });
  }

  const handleSend = (prompt: string) => {
    setLoading(true);
    addPrompt(prompt);
    socket.emit("user_message", { description: prompt, project_id: projectId });
  };

  const exampleMessages = [
    "Try our new feature for faster coding!",
    "Explore advanced settings for personalized recommendations.",
  ];

  return (
    <Flowbite>
      <div className="  h-full bg-slate-200 dark:bg-slate-900 ">
        <div className=" container  mx-auto flex flex-row  gap-10  bg-white   dark:bg-slate-950 dark:text-white ">
          <div className="w-1/4 shrink-0 flex-col items-center bg-slate-200 p-5 pt-10 dark:bg-slate-900 ">
            <PromptBox prompts={prompts} />
          </div>

          <div className=" mb-40 flex w-1/2 grow flex-col items-stretch  pt-10 ">
            <div className="mb-3">Iterative Canvas</div>
            <div className=" grow rounded-md border-2 border-solid border-gray-500">
              <LiveCodeEditor
                code={reactCode}
                css={undefined}
                cssFramework={"DAISYUI"}
              />
            </div>
            <div className="">
              <PromptInput loading={loading} onPromptSubmit={handleSend} />
            </div>
          </div>

          <div className="w-1/4  bg-slate-200  p-5 pt-10 dark:bg-slate-900 dark:text-white  ">
            <GenKodeChat messages={exampleMessages} />
          </div>
        </div>
      </div>
    </Flowbite>
  );
}
