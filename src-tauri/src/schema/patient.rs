use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub enum PatientState {
    Init,

    // 平稳期
    StableMild,     // 轻度
    StableModerate, // 中度
    StableSerious,  // 重度

    // 进展期
    ProgressiveMild,
    ProgressiveModerate,
    ProgressiveSerious,

    // 成熟期
    MatureMild,
    MatureModerate,
    MatureSerious,
}

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

    pub state: PatientState,
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
