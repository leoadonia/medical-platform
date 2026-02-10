use std::sync::{Arc, Mutex};

use tauri::{Result, State};

use crate::{
    media::article::PdfMetadata,
    schema::{
        article::{Article, ArticleState},
        PaginationData,
    },
    storage::Storage,
    system::Settings,
};

#[tauri::command]
pub async fn parse_pdf(
    settings: State<'_, Arc<Mutex<Settings>>>,
    pdf: &str,
) -> Result<PdfMetadata> {
    let settings = settings.lock().unwrap();
    let app_dir = settings.app_dir.clone().unwrap();
    let metadata = crate::media::article::parse_pdf(app_dir.as_str(), pdf)?;
    Ok(metadata)
}

#[tauri::command]
pub async fn save_article(storage: State<'_, Mutex<Storage>>, data: &str) -> Result<()> {
    let storage = storage.lock().unwrap();
    let article: Article = serde_json::from_str(data)?;
    let _ = storage.insert_article(&article)?;

    Ok(())
}

#[tauri::command]
pub async fn get_article_list(
    storage: State<'_, Mutex<Storage>>,
    state: Option<ArticleState>,
    page: i32,
    limit: i32,
) -> Result<PaginationData<Article>> {
    let storage = storage.lock().unwrap();
    let articles = storage.select_article_list(state, page, limit)?;
    Ok(articles)
}

#[tauri::command]
pub async fn delete_article(storage: State<'_, Mutex<Storage>>, id: i64) -> Result<()> {
    let storage = storage.lock().unwrap();
    storage.delete_article(id)?;
    Ok(())
}

#[tauri::command]
pub async fn update_article(storage: State<'_, Mutex<Storage>>, data: &str) -> Result<()> {
    let storage = storage.lock().unwrap();
    let article: Article = serde_json::from_str(data)?;
    storage.update_article(&article)?;
    Ok(())
}
