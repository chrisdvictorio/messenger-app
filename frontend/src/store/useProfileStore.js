import { create } from "zustand";

const useProfileStore = create((set) => ({
  selectedProfile: null,
  setSelectedProfile: (selectedProfile) => set({ selectedProfile }),

  viewProfile: null,
  setViewProfile: (viewProfile) => set({ viewProfile }),
}));

export default useProfileStore;
