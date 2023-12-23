import { create } from 'zustand'

interface ToolState {
  loading: boolean;
  projectId: string;
  reactCode: string;
  messages: string[];
  prompts: string[];

  setProjectId: (id: string) => void;
  setReactCode: (code: string) => void;
  setLoading: (isLoading: boolean) => void;
  addMessage: (message: string) => void;
  addPrompt: (prompt: string) => void;
}

export const useToolStore = create<ToolState>()((set) => ({
  loading: false,
  messages: [],
  prompts: [],
  projectId: "",
  reactCode: "",
  setProjectId: (id) => set(() => ({ projectId: id})),
  setReactCode: (code) => set(() => ({ reactCode: code})),
  setLoading: (isLoading) => set(() => ({ loading: isLoading})),
  addMessage: (message: string) => {set((state) => ({
    messages: [
      ...state.messages,
      message
    ]
    }))
  },
  addPrompt: (prompt: string) => {set((state) => ({
    prompts: [
      ...state.prompts,
      prompt
    ]
  }))
}
}));