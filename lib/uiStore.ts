import { create } from "zustand";

export type AuthMode = "login" | "signup";

export type User = {
  name: string;
};

type UIState = {
  authOpen: boolean;
  authMode: AuthMode;
  user: User | null;
  automationOpen: boolean;
  openAuth: (mode: AuthMode) => void;
  closeAuth: () => void;
  setAuthMode: (mode: AuthMode) => void;
  setUser: (user: User | null) => void;
  openAutomation: () => void;
  closeAutomation: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  authOpen: false,
  authMode: "login",
  user: null,
  automationOpen: false,
  openAuth: (mode) => set({ authOpen: true, authMode: mode }),
  closeAuth: () => set({ authOpen: false }),
  setAuthMode: (mode) => set({ authMode: mode }),
  setUser: (user) => set({ user }),
  openAutomation: () => set({ automationOpen: true }),
  closeAutomation: () => set({ automationOpen: false }),
}));
