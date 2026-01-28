import { User } from "@/lib/types/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Profile extends User {
  expires_at: number;
}

export interface ProfileState {
  profile?: Profile;

  setProfile: (profile: Profile) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: undefined,

      setProfile: (profile) => set({ profile }),
    }),
    {
      name: "sidebar-db",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ profile: state.profile }),
    },
  ),
);

export const useAuthorized = () =>
  useProfileStore(
    (state) =>
      state.profile !== undefined && state.profile.expires_at > Date.now(),
  );
