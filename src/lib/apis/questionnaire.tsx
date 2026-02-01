import { PaginationData } from "@/lib/types/pagination";
import { QuestionAnswer, Questionnaire } from "@/lib/types/questionnaire";
import { invoke } from "@tauri-apps/api/core";

export const addQuestionnaire = async (
  patient_id: number,
  answers: QuestionAnswer[],
) => {
  await invoke("add_questionnaire", {
    patient_id,
    answers: JSON.stringify(answers),
  });
};

export const getQuestionnaire = async (
  id: number,
): Promise<QuestionAnswer[]> => {
  const response = await invoke<QuestionAnswer[]>("get_questionnaire", { id });
  return response;
};

export const getQuestionnaireList = async (
  patient_id: number,
  page?: number,
  limit?: number,
): Promise<PaginationData<Questionnaire>> => {
  const response = await invoke<PaginationData<Questionnaire>>(
    "get_questionnaires",
    {
      patient_id,
      page: page || 1,
      limit: limit || 10,
    },
  );
  return response;
};
