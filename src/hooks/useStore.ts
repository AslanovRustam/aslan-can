import { create } from "zustand";

interface State {
  ready: boolean;
  isready: () => void;
}

export const useStore = create<State>((set) => ({
  ready: false,
  isready: () => set({ ready: true }),
}));
