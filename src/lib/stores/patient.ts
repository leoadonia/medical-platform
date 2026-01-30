import { DefaultPatient, Patient } from "@/lib/types/patient";
import { create } from "zustand";

export interface PatientState {
  patient: Patient;

  updatePatient: (data: Partial<Patient>) => void;
  clearPatient: () => void;
}

export const usePatientStore = create<PatientState>()((set) => ({
  patient: DefaultPatient,

  updatePatient: (data) =>
    set((state) => ({
      patient: { ...state.patient, ...data },
    })),

  clearPatient: () => set({ patient: DefaultPatient }),
}));
