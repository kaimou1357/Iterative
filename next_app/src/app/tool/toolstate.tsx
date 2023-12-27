import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ToolState {
  loading: boolean;
  reactCode: string;
  messages: string[];
  projectStates: ProjectState[];
  openDeploymentModal: boolean;

  setReactCode: (code: string) => void;
  setLoading: (isLoading: boolean) => void;
  addMessage: (message: string) => void;
  setProjectStates: (projectStates: ProjectState[]) => void;
  setOpenDeploymentModal: (openModal: boolean) => void;
}

export interface ProjectState {
  reactCode: string | null;
  prompt: string;
  id: number;
}

interface Project {
  projectId: string | null;
  setProjectId: (id: string | null) => void;
}

interface DeploymentState {
  deploymentName: string;
  passcode: string;
  projectStateId: number | null;
  modalOpen: boolean;

  setDeploymentName: (name: string) => void;
  setPasscode: (passcode: string) => void;
  setProjectStateId: (projectId: number) => void;
  setDeploymentModalOpen: (isOpen: boolean) => void;
}

export const useProjectStore = create<Project>()(
  persist(
    (set, get) => ({
      projectId: null,
      setProjectId: (id: string | null) => set({ projectId: id }),
    }),
    {
      name: "project-id-storage", // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default the 'localStorage' is used
    },
  ),
);

export const useDeploymentStore = create<DeploymentState>()((set) => ({
  deploymentName: "",
  passcode: "",
  projectStateId: null,
  modalOpen: false,
  setDeploymentName: (deploymentName) =>
    set(() => ({ deploymentName: deploymentName })),
  setPasscode: (passcode) => set(() => ({ passcode: passcode })),
  setProjectStateId: (projectId) => set(() => ({ projectStateId: projectId })),
  setDeploymentModalOpen: (isOpen) => set(() => ({ modalOpen: isOpen })),
}));

export const useToolStore = create<ToolState>()((set) => ({
  loading: false,
  messages: [],
  prompts: [],
  projectStates: [],
  reactCode: "",
  openDeploymentModal: false,

  setOpenDeploymentModal: (openModal: boolean) =>
    set(() => ({ openDeploymentModal: openModal })),
  setReactCode: (code) => set(() => ({ reactCode: code })),
  setLoading: (isLoading) => set(() => ({ loading: isLoading })),
  setProjectStates: (projectStates: ProjectState[]) =>
    set(() => ({ projectStates: projectStates })),
  addMessage: (message: string) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
}));
