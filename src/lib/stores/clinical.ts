import { getPatient } from "@/lib/apis/patient";
import { Clinical, DefaultClinical } from "@/lib/types/clinical";
import { Patient } from "@/lib/types/patient";
import { create } from "zustand";

export interface ClinicalState {
  clinical: Clinical;

  // The patient in view currently.
  patient?: Patient;

  setClinical: (clinical: Clinical) => void;
  updateClinical: (data: Partial<Clinical>) => void;
  resetClinical: (patient_id: number) => void;
  setViewedPatient: (patient: Patient) => void;
  clearViewedPatient: () => void;
  reloadPatient: () => Promise<void>; // The patient state might be updated if clinical is changed.
}

export const useClinicalStore = create<ClinicalState>()((set, get) => ({
  clinical: DefaultClinical,

  setClinical: (clinical) => set({ clinical }),

  updateClinical: (data) =>
    set((state) => ({
      clinical: { ...state.clinical, ...data },
    })),

  resetClinical: (patient_id: number) =>
    set({
      clinical: {
        ...DefaultClinical,
        patient_id,
      },
    }),

  setViewedPatient: (patient) => set({ patient }),
  clearViewedPatient: () => set({ patient: undefined }),
  reloadPatient: async () => {
    const current = get().patient;
    if (!current) {
      return;
    }

    const patient = await getPatient(current.id);
    set({ patient });
  },
}));
