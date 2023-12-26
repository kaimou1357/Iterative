import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ToolState {
  loading: boolean;
  reactCode: string;
  messages: string[];
  projectStates: ProjectState[];

  setReactCode: (code: string) => void;
  setLoading: (isLoading: boolean) => void;
  addMessage: (message: string) => void;
  setProjectStates: (projectStates: ProjectState[]) => void;
}

export interface ProjectState {
  reactCode: string | null;
  prompt: string;
  id: string;
}

interface Project {
  projectId: string | null;
  setProjectId: (id: string | null) => void;
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

export const useToolStore = create<ToolState>()((set) => ({
  loading: false,
  messages: [],
  prompts: [],
  projectStates: [],
  reactCode: "",
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
