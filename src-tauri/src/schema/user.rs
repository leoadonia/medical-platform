use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    #[serde(default)]
    pub id: i64,
    pub name: String,

    #[serde(skip_serializing)]
    pub password: String,

    #[serde(default)]
    pub created_at: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserSessionRequest {
    pub name: String,
    pub password: String,
}
