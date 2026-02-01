import { Radiology } from "@/lib/types/radiology";
import { invoke } from "@tauri-apps/api/core";
import { PaginationData } from "../types/pagination";

export const insertRadiology = async (radiology: Radiology) => {
  await invoke("insert_radiology", { data: JSON.stringify(radiology) });
};

export const updateRadiology = async (radiology: Radiology) => {
  await invoke("update_radiology", { data: JSON.stringify(radiology) });
};

export const selectRadiology = async (
  patientId: number,
  page?: number,
  limit?: number,
): Promise<PaginationData<Radiology>> => {
  const items = await invoke<PaginationData<Radiology>>(
    "select_radiology_list",
    {
      patient_id: patientId,
      page: page || 1,
      limit: limit || 10,
    },
  );
  return items;
};
