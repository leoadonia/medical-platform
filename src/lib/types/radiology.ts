export interface Radiology {
  patient_id: number;
  x_ray: string;
  posture_frontend: string;
  posture_backend: string;
  posture_left: string;
  posture_right: string;
}

export const DefaultRadiology: Radiology = {
  patient_id: 0,
  x_ray: "",
  posture_frontend: "",
  posture_backend: "",
  posture_left: "",
  posture_right: "",
};
