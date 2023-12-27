"use client";

import React from "react";
import GenKodeChat from "../components/chat";
import io, { Socket } from "socket.io-client";
import { API_BASE_URL, SOCKET_IO_URL } from "../components/config";
import LiveCodeEditor from "../components/LiveCodeEditor";
import { useEffect } from "react";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import PromptBox from "../components/userprompts";
import PromptInput from "../components/promptinput";
import { useProjectStore, useToolStore, ProjectState } from "./toolstate";
import { useStytchUser } from "@stytch/nextjs";
import { Flowbite } from "flowbite-react";
import axios from "axios";
import { DeploymentModal } from "../components/DeploymentModal";
import { ToastComponent } from "../components/Toast";
import { ProjectModal } from "../components/ProjectModal";
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export default function Tool() {
  const {
    loading,
    setLoading,
    setProjectStates,
    projectStates,
    reactCode,
    setReactCode,
    recommendations,
    addRecommendation,
    resetProject,
    setOpenProjectModal
  } = useToolStore();

  const { projectId, setProjectId } = useProjectStore();

  const { user } = useStytchUser();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    socket = io(SOCKET_IO_URL);
    socket.on("server_response", onServerResponse);
    socket.on("server_code", onServerCode);
    socket.on("project_id", onProjectId);
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    createProject();
  }, []);

  async function createProject() {
    const response = await axios.post(
      `${API_BASE_URL}/projects`,
      { project_id: projectId },
      { headers: { "Content-Type": "application/json" } },
    );
    setProjectId(response.data.project.id);
    refreshProjectStates();
  }

  const onServerResponse = (response: any) => {
    addRecommendation(response);
  };

  const refreshProjectStates = () => {
    axios
      .post(
        `${API_BASE_URL}/projects/project_state`,
        { project_id: projectId },
        { headers: { "Content-Type": "application/json" } },
      )
      .then((response: any) => {
        const projectStates = response.data.project_states.map((p: any) => {
          const pState: ProjectState = {
            id: p.id,
            reactCode: p.reactCode,
            prompt: p.messages[0] ? p.messages[0].content : null,
          };
          return pState;
        });
        setProjectStates(projectStates);
      });
  };

  const onServerCode = (response: any) => {
    setLoading(false);
    setReactCode(response);
    refreshProjectStates();
  };

  const onProjectId = (projectId: any) => {
    setProjectId(projectId);
  };

  const onLoadClick = (reactCode: string | null) => {
    if (reactCode !== null) {
      setReactCode(reactCode);
    }
  };

  async function onResetProject() {
    const response = await axios.post(
      `${API_BASE_URL}/projects/reset`,
      { project_id: projectId },
      { headers: { "Content-Type": "application/json" } },
    );
    resetProject();
  }

  const handleSend = (prompt: string) => {
    setLoading(true);
    socket.emit("user_message", { description: prompt, project_id: projectId });
  };

  return (
    <Flowbite>
      <div className="h-full bg-slate-200 dark:bg-slate-900 ">
        <ToastComponent/>
        <DeploymentModal />
        <ProjectModal projectId={projectId} />
        <div className=" container  mx-auto flex flex-row  gap-10  bg-white   dark:bg-slate-950 dark:text-white ">
          <div className="w-1/4 shrink-0 flex-col items-center bg-slate-200 p-5 pt-10 dark:bg-slate-900 ">
            <PromptBox
              onLoadClick={onLoadClick}
              projectStates={projectStates}
              authenticated={user !== null}
            />
          </div>

          <div className=" mb-40 flex w-1/2 grow flex-col items-stretch  pt-10 ">
            <div className=" grow rounded-md border-2 border-solid border-gray-500">
              <LiveCodeEditor
                code={reactCode}
                css={undefined}
                cssFramework={"DAISYUI"}
              />
            </div>
            <div className="">
              <PromptInput
                loading={loading}
                onProjectReset={onResetProject}
                onPromptSubmit={handleSend}
                onProjectSaveClicked={setOpenProjectModal}
                isAuthenticated={user !== null}
              />
            </div>
          </div>

          <div className="w-1/4  bg-slate-200  p-5 pt-10 dark:bg-slate-900 dark:text-white  ">
            <GenKodeChat recommendations={recommendations} />
          </div>
        </div>
      </div>
    </Flowbite>
  );
}
