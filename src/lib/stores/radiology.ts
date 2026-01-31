import { Patient } from "@/lib/types/patient";
import { DefaultRadiology, Radiology } from "@/lib/types/radiology";
import { create } from "zustand";

export interface RadiologyState {
  radiology: Radiology;

  // The patient in view currently.
  patient?: Patient;

  setRadiology: (radiology: Radiology) => void;
  updateRadiology: (data: Partial<Radiology>) => void;
  resetRadiology: (patient_id: number) => void;
  setViewedPatient: (patient: Patient) => void;
  clearViewedPatient: () => void;
}

export const useRadiologyStore = create<RadiologyState>()((set) => ({
  radiology: DefaultRadiology,

  setRadiology: (radiology) => set({ radiology }),

  updateRadiology: (data) =>
    set((state) => ({
      radiology: { ...state.radiology, ...data },
    })),

  resetRadiology: (patient_id: number) =>
    set({
      radiology: {
        ...DefaultRadiology,
        patient_id,
      },
    }),

  setViewedPatient: (patient) => set({ patient }),
  clearViewedPatient: () => set({ patient: undefined }),
}));
