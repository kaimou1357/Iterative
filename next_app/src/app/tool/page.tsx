"use client";

import React, { useState } from "react";
import { RecommendationsList } from "../components/RecommendationsList";
import io, { Socket } from "socket.io-client";
import { API_BASE_URL, SOCKET_IO_URL } from "../components/config";
import LiveCodeEditor from "../components/LiveCodeEditor";
import { useEffect } from "react";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import PromptBox from "../components/userprompts";
import PromptInput from "../components/promptinput";
import { useProjectStore, useToolStore, ProjectState } from "./toolstate";
import { useStytchUser } from "@stytch/nextjs";
import { Button, DarkThemeToggle, Flowbite } from "flowbite-react";
import axios from "axios";
import { DeploymentModal } from "../components/DeploymentModal";
import { ToastComponent } from "../components/Toast";
import { ProjectModal } from "../components/ProjectModal";
import Loading from "../components/loading";
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
    setRecommendations,
    resetProject,
    setOpenProjectModal,
  } = useToolStore();

  const { projectId, setProjectId, setProjectName, projectName } =
    useProjectStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user } = useStytchUser();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    socket = io(SOCKET_IO_URL);
    socket.on("server_recommendation", onServerResponse);
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
    setIsLoading(true);
    const response = await axios.post(
      `${API_BASE_URL}/projects`,
      { project_id: projectId },
      { headers: { "Content-Type": "application/json" } },
    );
    setIsLoading(false);
    setProjectId(response.data.project.id);
    setProjectName(response.data.project.name);
    refreshProjectStates();
    refreshRecommendations();
  }

  async function refreshRecommendations() {
    const response = await axios.get(
      `${API_BASE_URL}/recommendations?project_id=${projectId}`,
    );
    setRecommendations(response.data.recommendations);
  }

  const onServerResponse = () => {
    refreshRecommendations();
  };

  const refreshProjectStates = () => {
    setIsLoading(true);
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
        setIsLoading(false);
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
    setIsLoading(true);
    const response = await axios.post(
      `${API_BASE_URL}/projects/reset`,
      { project_id: projectId },
      { headers: { "Content-Type": "application/json" } },
    );
    setIsLoading(false);
    resetProject();
  }

  const handleSend = (prompt: string) => {
    setLoading(true);
    socket.emit("user_message", { description: prompt, project_id: projectId });
  };

  return (
    <Flowbite>
      <div className="h-[calc(100vh-62px)] bg-slate-200 dark:bg-slate-900 ">
        <ToastComponent />
        <DeploymentModal />
        <ProjectModal projectId={projectId} />
        <div className=" container mx-auto flex h-[90%] max-h-full flex-row gap-10 dark:text-white ">
          <div className=" flex w-full justify-between gap-4 pt-10 ">
            <div className="w-[20%] flex-col items-center bg-slate-200 dark:bg-slate-900 ">
              {/* <Button color="dark" className="mx-auto">Existing User Prompts</Button> */}
              <PromptBox
                user={user}
                onLoadClick={onLoadClick}
                projectStates={projectStates}
                authenticated={user !== null}
              />
            </div>
            <div
              className={`${
                recommendations.length ? "w-[60%]" : "w-[80%]"
              } flex h-full flex-col`}
            >
              <h1 className="mx-auto mb-2 text-xl font-bold">{projectName}</h1>
              <div className="min-h-[72%] max-w-full grow rounded-md border-2 border-solid border-gray-500">
                <LiveCodeEditor
                  code={reactCode}
                  css={undefined}
                  cssFramework={"DAISYUI"}
                />
              </div>
              <PromptInput
                loading={loading}
                user={user}
                onProjectReset={onResetProject}
                onPromptSubmit={handleSend}
                onProjectSaveClicked={setOpenProjectModal}
                isAuthenticated={user !== null}
              />
            </div>
            {recommendations && recommendations.length ? (
              <div className="w-[20%]">
                <div className="w-full bg-slate-200 text-black dark:bg-slate-900 dark:text-white ">
                  <RecommendationsList recommendations={recommendations} />
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      {isLoading && <Loading />}
    </Flowbite>
  );
}
