use serde::{Deserialize, Serialize};

use crate::schema::clinical;

#[derive(Debug, Serialize, Deserialize)]
pub struct Patient {
    pub id: i64,
    pub registration_number: String,
    pub name: String,
    pub gender: String,
    pub menarche: Option<i8>,
    pub birthday: i64,
    pub school: String,
    pub grade: String,
    pub weight: f32,
    pub height: f32,
    pub contact: String,

    #[serde(default)]
    pub created_at: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MedicalImage {
    pub x_ray: String,
    pub posture_frontend: String,
    pub posture_backend: String,
    pub posture_left: String,
    pub posture_right: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct QuestionAnswer {
    #[serde(rename = "index")]
    pub question_idx: i64,
    pub score: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TreatmentCourse {
    pub id: i64,
    pub patient_id: i64,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TreatmentCourseBody {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub image: Option<MedicalImage>,
    pub clinical: clinical::Clinical,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct QuestionnaireWithPatient {
    pub id: i64,
    pub score: i16,
    pub created_at: i64,
    pub registration_number: String,
    pub name: String,
    pub gender: String,
    pub birthday: i64,
    pub weight: f32,
    pub height: f32,
}
