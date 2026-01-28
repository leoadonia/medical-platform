use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Brace {
    #[serde(rename = "type")]
    pub brace_type: String,
    pub daily_duration: i8,
    pub skin_complications: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClinicalExercise {
    #[serde(rename = "type")]
    pub exercise_type: String,
    pub frequency: i8,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Mobility {
    pub flexion: i8,
    pub extension: i8,
    pub lateral: i8,
    pub rotation: i8,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Balance {
    pub left: i8,
    pub right: i8,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FlexionAtr {
    pub position: String,
    pub degree: i8,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Posture {
    pub head_centered: String,
    pub acromial_level: String,
    pub scapula_level: String,
    pub kyphosis: bool,
    pub flatback: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Clinical {
    #[serde(default)]
    pub parent_id: i64,

    #[serde(default)]
    pub treatment_course_id: i64,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub brace: Option<Brace>,
    pub treatment: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub exercise: Option<ClinicalExercise>,
    pub mobility: Mobility,
    pub balance: Balance,
    pub tenderness: String,
    pub percussion: String,
    pub posture: Posture,
    pub cobb: i32,
    pub flexion_atr: FlexionAtr,
    pub pain_rate: i8,
}
