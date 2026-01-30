import { DefaultPatient, Patient } from "@/lib/types/patient";
import { create } from "zustand";

export interface PatientState {
  patient: Patient;

  setPatient: (patient: Patient) => void;
  updatePatient: (data: Partial<Patient>) => void;
  clearPatient: () => void;
}

export const usePatientStore = create<PatientState>()((set) => ({
  patient: DefaultPatient,

  setPatient: (patient) => set({ patient }),

  updatePatient: (data) =>
    set((state) => ({
      patient: { ...state.patient, ...data },
    })),

  clearPatient: () => set({ patient: DefaultPatient }),
}));
