import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ToolState {
  loading: boolean;
  reactCode: string;
  recommendations: Recommendation[];
  projectStates: ProjectState[];
  openDeploymentModal: boolean;
  openProjectModal: boolean;
  shouldShowToast: boolean;
  toastMessage: string;

  showToast: (message: string) => void;
  removeToast: () => void;
  setReactCode: (code: string) => void;
  setLoading: (isLoading: boolean) => void;
  setRecommendations: (recommendations: Recommendation[]) => void;
  setProjectStates: (projectStates: ProjectState[]) => void;
  setOpenDeploymentModal: (openModal: boolean) => void;
  setOpenProjectModal: (openModal: boolean) => void;
  resetProject: () => void;
}

export const useToolStore = create<ToolState>()((set) => ({
  loading: false,
  recommendations: [],
  projectStates: [],
  reactCode: "",
  openDeploymentModal: false,
  openProjectModal: false,
  shouldShowToast: false,
  toastMessage: "",

  showToast: (message) =>
    set(() => ({ shouldShowToast: true, toastMessage: message })),
  resetProject: () =>
    set(() => ({
      prompts: [],
      projectStates: [],
      reactCode: "",
      recommendations: [],
    })),
  removeToast: () => set(() => ({ shouldShowToast: false })),
  setOpenDeploymentModal: (openModal: boolean) =>
    set(() => ({ openDeploymentModal: openModal })),
  setOpenProjectModal: (openModal: boolean) =>
    set(() => ({ openProjectModal: openModal })),
  setReactCode: (code) => set(() => ({ reactCode: code })),
  setLoading: (isLoading) => set(() => ({ loading: isLoading })),
  setProjectStates: (projectStates: ProjectState[]) =>
    set(() => ({ projectStates: projectStates })),
  setRecommendations: (newRecommendations: Recommendation[]) => {
    set(() => ({
      recommendations: newRecommendations,
    }));
  },
}));

export interface ProjectState {
  reactCode: string | null;
  prompt: string;
  id: number;
}

interface Project {
  projectId: string | null;
  setProjectId: (id: string | null) => void;
  projectName: string;
  setProjectName: (name: string) => void;
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
      projectName: "",
      setProjectId: (id: string | null) => set({ projectId: id }),
      setProjectName: (name: string) => set({ projectName: name }),
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
