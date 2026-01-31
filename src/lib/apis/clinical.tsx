import { Clinical } from "@/lib/types/clinical";
import { PaginationData } from "@/lib/types/pagination";
import { invoke } from "@tauri-apps/api/core";

export const getClinicalList = async (
  patient_id: number,
  page?: number,
  limit?: number,
): Promise<PaginationData<Clinical>> => {
  const response = await invoke<PaginationData<Clinical>>("get_clinical_list", {
    patient_id,
    page: page || 1,
    limit: limit || 10,
  });

  return response;
};

export const createClinical = async (clinical: Clinical): Promise<void> => {
  await invoke("insert_clinical", { data: JSON.stringify(clinical) });
};
