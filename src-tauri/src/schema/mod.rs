use serde::{Deserialize, Serialize};

pub mod clinical;
pub mod patient;
pub mod questionnaire;
pub mod radiology;
pub mod user;

#[derive(Debug, Serialize, Deserialize)]
pub struct PaginationData<T> {
    pub total: i64,
    pub items: Vec<T>,
    pub page: i32,
    pub limit: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PatientSearchRequest {
    pub name: Option<String>,
    pub registration_number: Option<String>,
    pub contact: Option<String>,
}
