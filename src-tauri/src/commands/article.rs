use std::sync::Mutex;

use tauri::{Result, State};

use crate::{
    schema::{
        article::{Article, ArticleState},
        PaginationData,
    },
    storage::Storage,
    system::article::PdfMetadata,
};

#[tauri::command]
pub async fn parse_pdf(pdf: &str) -> Result<PdfMetadata> {
    let metadata = crate::system::article::parse_pdf(pdf)?;
    Ok(metadata)
}

#[tauri::command]
pub async fn article_remove_temp(data: &str) -> Result<()> {
    let meta: PdfMetadata = serde_json::from_str(data)?;
    crate::system::article::remove_temp(&meta)?;
    Ok(())
}

#[tauri::command]
pub async fn save_article(
    storage: State<'_, Mutex<Storage>>,
    meta: &str,
    data: &str,
) -> Result<()> {
    let storage = storage.lock().unwrap();
    let article: Article = serde_json::from_str(data)?;
    let _ = storage.insert_article(&article)?;

    let meta: PdfMetadata = serde_json::from_str(meta)?;
    crate::system::article::remove_temp(&meta)?;

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
