import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SidebarState {
  collapsed: boolean;

  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,

      toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),

      setCollapsed: (collapsed: boolean) => set({ collapsed }),
    }),
    {
      name: "sidebar-db",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ collapsed: state.collapsed }),
    },
  ),
);

interface Breadcrumb {
  title: React.ReactNode;
  href: string;
}

interface NavbarState {
  crumbs: Breadcrumb[];

  addRouter: (crumb: Breadcrumb) => void;
  back: () => string;
  clear: () => void;
  jump: (index: number) => void;
}

export const useNavbarStore = create<NavbarState>()((set, get) => ({
  crumbs: [],

  addRouter: (crumb: Breadcrumb) => {
    set((state) => ({
      crumbs: [...state.crumbs, crumb],
    }));
  },

  back: () => {
    const crumbs = get().crumbs;
    const last = crumbs.length > 1 ? crumbs[crumbs.length - 2].href : "";

    set((state) => ({
      crumbs: state.crumbs.slice(0, -1),
    }));

    return last;
  },

  clear: () => {
    set({ crumbs: [] });
  },

  jump: (index: number) => {
    const crumbs = get().crumbs;
    if (index < 0 || index >= crumbs.length) {
      return;
    }

    set({ crumbs: crumbs.slice(0, index + 1) });
  },
}));
