use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct QuestionAnswer {
    #[serde(rename = "index")]
    pub question_idx: i64,
    pub score: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Questionnaire {
    pub id: i64,
    pub patient_id: i64,
    pub score: i16,
    pub created_at: i64,
}
