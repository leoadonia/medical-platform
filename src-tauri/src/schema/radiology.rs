use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Radiology {
    #[serde(default)]
    pub id: i64,

    pub patient_id: i64,
    pub x_ray: String,
    pub posture_frontend: String,
    pub posture_backend: String,
    pub posture_left: String,
    pub posture_right: String,
    pub created_at: i64,
}
