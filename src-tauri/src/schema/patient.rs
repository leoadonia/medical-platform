use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq)]
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

impl PatientState {
    pub fn from_clinical(risser: i8, cobb: i32) -> Self {
        if cobb < 10 || cobb > 40 {
            return PatientState::Init;
        }

        if cobb < 20 {
            return match risser {
                0 => PatientState::StableMild,
                1 | 2 | 3 => PatientState::ProgressiveMild,
                _ => PatientState::MatureMild,
            };
        }

        if cobb < 40 {
            return match risser {
                0 => PatientState::StableModerate,
                1 | 2 | 3 => PatientState::ProgressiveModerate,
                _ => PatientState::MatureModerate,
            };
        }

        match risser {
            0 => PatientState::StableSerious,
            1 | 2 | 3 => PatientState::ProgressiveSerious,
            _ => PatientState::MatureSerious,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Patient {
    pub id: i64,
    pub registration_number: String,
    pub name: String,
    pub gender: String,

    #[serde(skip_serializing_if = "Option::is_none")]
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
