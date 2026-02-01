import { Patient } from "@/lib/types/patient";
import { QuestionAnswer } from "@/lib/types/questionnaire";
import { create } from "zustand";

export interface QuestionnaireState {
  answers: QuestionAnswer[];
  viewMode?: boolean;

  // The patient in view currently.
  patient?: Patient;

  setAnswer: (index: number, answer: QuestionAnswer) => void;
  clearAnswers: () => void;
  setViewMode: (answers: QuestionAnswer[]) => void;

  setViewedPatient: (patient: Patient) => void;
  clearViewedPatient: () => void;
}

export const useQuestionnaireStore = create<QuestionnaireState>()((set) => ({
  answers: [],

  setAnswer: (index, answer) =>
    set((state) => ({
      answers: [
        ...state.answers.slice(0, index),
        answer,
        ...state.answers.slice(index + 1),
      ],
    })),

  clearAnswers: () => set({ answers: [], viewMode: false }),

  setViewMode: (answers) => set({ viewMode: true, answers }),

  setViewedPatient: (patient) => set({ patient }),
  clearViewedPatient: () => set({ patient: undefined }),
}));
