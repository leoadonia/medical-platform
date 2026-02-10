import { User } from "@/lib/types/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Profile extends User {
  expires_at: number;
}

export interface ProfileState {
  profile?: Profile;
  _hasHydrated: boolean;

  setProfile: (profile: Profile) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: undefined,
      _hasHydrated: false,

      setProfile: (profile) => set({ profile }),

      clearProfile: () => set({ profile: undefined }),
    }),
    {
      name: "sidebar-db",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ profile: state.profile }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
    },
  ),
);

export const useAuthorized = () =>
  useProfileStore(
    (state) =>
      state.profile !== undefined && state.profile.expires_at > Date.now(),
  );
