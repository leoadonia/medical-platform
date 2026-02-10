import { PaginationData } from "@/lib/types/pagination";
import { Patient, SearchParams } from "@/lib/types/patient";
import { invoke } from "@tauri-apps/api/core";

export const getPatients = async (
  request: SearchParams,
  page?: number,
  limit?: number,
): Promise<PaginationData<Patient>> => {
  const response = await invoke<PaginationData<Patient>>("get_patients", {
    data: JSON.stringify(request),
    page: page || 1,
    limit: limit || 10,
  });

  return response;
};

export const createPatient = async (patient: Patient): Promise<number> => {
  const response = await invoke<number>("create_patient", {
    data: JSON.stringify(patient),
  });

  return response;
};

export const updatePatient = async (patient: Patient): Promise<void> => {
  await invoke<void>("update_patient", {
    data: JSON.stringify(patient),
  });
};

export const getPatient = async (id: number): Promise<Patient> => {
  const response = await invoke<Patient>("get_patient", {
    id,
  });

  return response;
};
