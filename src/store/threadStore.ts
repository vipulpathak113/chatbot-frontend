import { create } from "zustand";
import { Thread } from "@/types/thread";
import { getThreads } from "@/services/threadService";

interface ThreadState {
  threads: Thread[];
  setThreads: (threads: Thread[]) => void;
  fetchThreads: () => Promise<void>;
}

export const useThreadStore = create<ThreadState>((set) => ({
  threads: [],

  setThreads: (threads: Thread[]) => set({ threads }),

  fetchThreads: async () => {
    const data = await getThreads();
    set({ threads: data });
  },
}));