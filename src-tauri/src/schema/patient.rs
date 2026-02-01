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
