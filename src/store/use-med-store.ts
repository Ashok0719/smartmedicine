import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MedState {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  notifications: any[];
  addNotification: (notification: any) => void;
  clearNotifications: () => void;
}

export const useMedStore = create<MedState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 50),
        })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: "med-storage",
    }
  )
);
