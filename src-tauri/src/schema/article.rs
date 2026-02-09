use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Article {
    #[serde(default)]
    pub id: i64,

    pub title: String,
    pub summary: String,
    pub cover: Option<String>,
    pub origin_file: String,
    pub state: ArticleState,

    #[serde(default)]
    pub created_at: i64,

    #[serde(default)]
    pub updated_at: i64,
}

#[derive(Debug, Serialize, Deserialize, Copy, Clone)]
pub enum ArticleState {
    Init,
    Published,
}
