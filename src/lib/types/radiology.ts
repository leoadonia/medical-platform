export interface Radiology {
  id: number;
  patient_id: number;
  x_ray: string;
  posture_frontend: string;
  posture_backend: string;
  posture_left: string;
  posture_right: string;
  created_at: number;
}

export const DefaultRadiology: Radiology = {
  id: 0,
  patient_id: 0,
  x_ray: "",
  posture_frontend: "",
  posture_backend: "",
  posture_left: "",
  posture_right: "",
  created_at: 0,
};
